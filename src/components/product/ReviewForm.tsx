"use client";

import { useState, useRef, useCallback } from "react";
import { Star, MessageSquare, ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_text: string;
  image_urls: string[];
  created_at: string;
}

interface ReviewFormProps {
  onReviewSubmitted: (review: Review) => void;
}

interface ImageFile {
  file: File;
  preview: string;
}

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET = "review-images";

export default function ReviewForm({ onReviewSubmitted }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: File[]) => {
    setImageError("");
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);

    const invalid = toAdd.find(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE
    );
    if (invalid) {
      if (!ALLOWED_TYPES.includes(invalid.type)) {
        setImageError("Only JPG, PNG, and WebP images are allowed.");
      } else {
        setImageError("Each image must be under 5 MB.");
      }
      return;
    }

    const newEntries: ImageFile[] = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newEntries]);
  }, [images.length]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
    setImageError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addImages(Array.from(e.target.files));
    // Reset input so the same file can be re-selected if removed
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addImages(Array.from(e.dataTransfer.files));
  };

  const uploadImages = async (reviewId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const { file } of images) {
      const ext = file.name.split(".").pop();
      const path = `${reviewId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Insert the review row first to get an ID for the storage path
      const { data: inserted, error: dbError } = await supabase
        .from("reviews")
        .insert({
          reviewer_name: name.trim(),
          star_rating: rating,
          review_text: reviewText.trim(),
          image_urls: [],
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Upload images (if any) using the review ID as folder name
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(inserted.id);

        // 3. Update the row with the real URLs
        const { error: updateError } = await supabase
          .from("reviews")
          .update({ image_urls: imageUrls })
          .eq("id", inserted.id);
        if (updateError) throw updateError;
      }

      const finalReview: Review = { ...inserted, image_urls: imageUrls };
      onReviewSubmitted(finalReview);
      setSubmitted(true);
      setName("");
      setRating(0);
      setReviewText("");
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);

      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Unable to submit review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-brand-text">
          Share Your Experience
        </h3>
      </div>

      {submitted && (
        <div className="mb-6 py-3 px-5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-fade-in-up">
          ✨ Thank you for your review!
        </div>
      )}

      {error && (
        <div className="mb-4 py-3 px-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="reviewer-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Name
          </label>
          <input
            id="reviewer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
          />
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Review
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with Luwia Cream..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Photos{" "}
            <span className="text-gray-400 font-normal">
              (optional · up to {MAX_IMAGES} · max 5 MB each)
            </span>
          </label>

          {/* Preview strip */}
          {images.length > 0 && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone — only shown when under the limit */}
          {images.length < MAX_IMAGES && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary/40 hover:bg-brand-bg/30 transition-all"
            >
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <p className="text-xs text-gray-500 text-center">
                Click or drag &amp; drop to add photos
                <br />
                <span className="text-[10px] text-gray-400">
                  {MAX_IMAGES - images.length} slot{MAX_IMAGES - images.length !== 1 ? "s" : ""} remaining
                </span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="review-images-input"
              />
            </div>
          )}

          {imageError && (
            <p className="mt-2 text-xs text-red-500">{imageError}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {images.length > 0 ? "Uploading photos…" : "Submitting…"}
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
}
