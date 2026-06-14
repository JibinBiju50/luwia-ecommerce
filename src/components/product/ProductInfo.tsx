"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Truck, Star, Flame, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { addToCart as fbAddToCart, initiateCheckout } from "@/lib/fbpixel";
import type { Product } from "@/lib/products";

export interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_text: string;
  image_urls: string[];
  created_at: string;
}

interface ProductInfoProps {
  product: Product;
  avgRating: number;
  totalCount: number;
}

export default function ProductInfo({ product, avgRating, totalCount }: ProductInfoProps) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const { addToCart, couponApplied, applyCoupon } = useCart();
  const { user, openMagicLinkModal, pendingCartAction: pendingCartActionRef } = useAuth();
  const router = useRouter();

  const reviewCount = totalCount;
  const rating = avgRating;

  const [showAutoCouponModal, setShowAutoCouponModal] = useState(false);

  useEffect(() => {
    // If already applied, do nothing
    if (couponApplied) return;

    const timer = setTimeout(() => {
      // Show modal
      setShowAutoCouponModal(true);
      
      // Fire confetti from center of screen
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#1E3A8A', '#60A5FA', '#FFFFFF'],
        zIndex: 100 // ensure above modal
      });
      
      // Actually apply it to global state
      applyCoupon();

      // Dismiss after 4 seconds
      setTimeout(() => {
        setShowAutoCouponModal(false);
      }, 4000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [couponApplied, applyCoupon]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Store the cart action — fires automatically after sign-in
      pendingCartActionRef.current = () => addToCart(product.id, selectedQty);
      openMagicLinkModal();
      return;
    }
    addToCart(product.id, selectedQty);
    // Fire Meta Pixel AddToCart
    fbAddToCart({
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.onlinePrice * selectedQty,
      currency: "INR",
      num_items: selectedQty,
    });
  };

  const handleBuyNow = () => {
    // Save direct-buy item to sessionStorage — doesn't touch the cart at all
    sessionStorage.setItem(
      "luwia-direct-buy",
      JSON.stringify({ productId: product.id, quantity: selectedQty })
    );
    // Fire Meta Pixel InitiateCheckout
    initiateCheckout({
      num_items: selectedQty,
      value: product.onlinePrice * selectedQty,
      currency: "INR",
    });
    router.push("/checkout");
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.shortDescription,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // User cancelled or error
    }
  };

  const handleApplyCoupon = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#60A5FA', '#FFFFFF']
    });
    applyCoupon();
  };

  const decrementQty = () => setSelectedQty((q) => Math.max(1, q - 1));
  const incrementQty = () => setSelectedQty((q) => Math.min(product.maxQuantity, q + 1));

  return (
    <div className="space-y-5">
      {/* Auto Coupon Modal Overlay */}
      {showAutoCouponModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-[90%] text-center shadow-2xl animate-in zoom-in duration-300 ring-1 ring-brand-primary/10">
            <span className="text-5xl animate-bounce inline-block mb-4">🎉</span>
            <h2 className="text-2xl font-bold text-brand-text mb-2">Coupon Applied!</h2>
            <p className="text-gray-500 mb-6 text-sm">We've automatically applied <span className="font-bold text-brand-primary">LUWIAGLOW53</span> for you!</p>
            <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 shadow-inner">
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Discounted Price</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {product.currencySymbol}{product.onlinePrice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Title + Wishlist */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-text leading-tight break-words">
            {product.name}
          </h1>

          {/* Star rating */}
          <button 
            onClick={() => {
              document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 mt-2 hover:opacity-75 transition-opacity text-left cursor-pointer"
            aria-label="Scroll to reviews"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-400/30 text-amber-400/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-2">
              {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews yet)"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Share */}
          <button
            onClick={handleShare}
            className="relative p-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
            {shared && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-green-600 whitespace-nowrap bg-green-50 px-2 py-0.5 rounded">
                Link copied!
              </span>
            )}
          </button>
          {/* Wishlist */}
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-full border transition-all ${
              liked
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Characteristic tags banner — full width */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 -mt-2">
        {[
          "All Skin Types",
          "Brightens Skin Tone",
          "Fades Dark Spots",
          "Deep Moisturization",
          "Repairs Skin Barrier",
          "Dermatologically Tested",
        ].map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #fef9f4 0%, #fdf3e7 100%)",
              color: "#7c5c3a",
              border: "1px solid #f0d9bc",
              boxShadow: "0 1px 3px rgba(180,130,60,0.08)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
        <span className="text-3xl font-bold text-brand-text">
          {product.currencySymbol}{couponApplied ? product.onlinePrice : product.originalPrice}
        </span>
        {couponApplied && (
          <span className="text-lg text-gray-400 line-through">
            {product.currencySymbol}{product.originalPrice}
          </span>
        )}
        {couponApplied && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Save {product.currencySymbol}{product.originalPrice - product.onlinePrice}
          </span>
        )}
      </div>

      {/* Coupon Box */}
      {!couponApplied ? (
        <div className="p-4 border border-brand-primary/20 bg-brand-light/5 rounded-xl flex items-center justify-between shadow-sm transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-bold text-brand-text flex items-center gap-1.5">
              <span className="text-base">🎁</span> Have a coupon?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Apply code <span className="font-bold text-brand-primary">LUWIAGLOW53</span> for 53% OFF!</p>
          </div>
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-primary rounded-lg shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-green-700">
            <span className="text-2xl animate-bounce">🎉</span>
            <div>
              <p className="text-sm font-bold">LUWIAGLOW53 Applied!</p>
              <p className="text-xs text-green-600">You got a 53% discount on this product.</p>
            </div>
          </div>
        </div>
      )}

      {/* Free Delivery */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-green-600 bg-green-50/50 px-3 sm:px-4 py-2.5 rounded-xl">
        <Truck className="w-4 h-4" />
        <span className="text-sm font-medium">Free Delivery</span>
        <span className="text-xs text-gray-500 ml-1">• 3-5 business days</span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          Quantity
        </span>
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
          <button
            onClick={decrementQty}
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
            disabled={selectedQty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
            {selectedQty}
          </span>
          <button
            onClick={incrementQty}
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
            disabled={selectedQty >= product.maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3.5 text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all active:scale-[0.97] active:bg-brand-primary/10"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-all shadow-brand active:scale-[0.97] active:shadow-inner"
        >
          Buy Now
        </button>
      </div>

      {/* Sold & Views Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 bg-orange-50/80 border border-orange-100/50 rounded-xl py-3 px-4 text-brand-dark font-extrabold text-[13px] sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-red-500 stroke-[2.5]" />
          <span>10K+ sold recently</span>
        </div>
        <span className="hidden sm:inline text-gray-300 font-normal">|</span>
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-gray-500 stroke-[2.5]" />
          <span>25k+ views today</span>
        </div>
      </div>

      {/* All India Shipping */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-light/10 border border-brand-primary/10 rounded-xl text-brand-text shadow-sm mt-4">
        <Truck className="w-5 h-5 text-brand-primary" />
        <span className="text-sm font-bold tracking-wide uppercase">All India Shipping</span>
      </div>

      {/* Payment Methods */}
      <div className="py-4 px-4 bg-brand-light/10 border border-brand-primary/10 rounded-xl shadow-sm mt-3">
        <Image
          src="/images/payment_method.png"
          alt="Secure Payment Methods"
          width={400}
          height={60}
          className="w-full h-auto object-contain drop-shadow-sm"
        />
      </div>
    </div>
  );
}
