"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Truck, Star, Flame, Eye } from "lucide-react";
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

  useEffect(() => {
    // Instantly apply coupon when page opens
    if (!couponApplied) {
      applyCoupon();
    }
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



  const decrementQty = () => setSelectedQty((q) => Math.max(1, q - 1));
  const incrementQty = () => setSelectedQty((q) => Math.min(product.maxQuantity, q + 1));

  return (
    <div className="space-y-3">

      {/* Title + Wishlist */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-brand-text leading-tight break-words">
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
            <span className="text-xs text-gray-500 decoration-gray-300 underline-offset-2">
              {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews yet)"}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Share */}
          <button
            onClick={handleShare}
            className="relative p-2 rounded-full border border-gray-200 text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
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
            className={`p-2 rounded-full border transition-all ${
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

      <div className="flex flex-col md:flex-row md:items-center gap-4">
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
        </div>

        {/* Coupon Box */}
        <div className="flex-1 max-w-sm">
          {!couponApplied ? (
            <div className="p-3 border border-brand-primary/20 bg-brand-light/5 rounded-xl flex items-center justify-between shadow-sm transition-all hover:shadow-md">
              <div>
                <p className="text-sm font-bold text-brand-text flex items-center gap-1.5">
                  <span className="text-base">🎁</span> Have a coupon?
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Apply code <span className="font-bold text-brand-primary">LUWIAGLOW53</span> for 53% OFF!</p>
              </div>
              <button
                onClick={applyCoupon}
                className="px-3 py-1.5 text-xs font-bold text-white bg-brand-primary rounded-lg shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="p-3 border border-green-200 bg-green-50 rounded-xl flex items-center gap-3 shadow-sm">
              <span className="text-2xl animate-bounce">🎉</span>
              <div>
                <p className="text-sm font-bold text-green-700">LUWIAGLOW53 Applied!</p>
                <p className="text-xs text-green-600">You got a 53% discount.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mt-4 border-b border-gray-100 pb-5">
        Glass skin begins tonight. Advanced brightening actives meet deep overnight hydration for smoother, healthier, more luminous skin by morning. Perfect for all skin types
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex gap-3 h-[48px] sm:h-[52px]">
          {/* Quantity */}
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shrink-0">
            <button
              onClick={decrementQty}
              className="px-4 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
              disabled={selectedQty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold min-w-[24px] text-center">
              {selectedQty}
            </span>
            <button
              onClick={incrementQty}
              className="px-4 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
              disabled={selectedQty >= product.maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="flex-1 h-full text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all active:scale-[0.97] active:bg-brand-primary/10"
          >
            Add to Cart
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          className="w-full h-[52px] sm:h-[56px] text-sm font-bold text-white gradient-brand rounded-full hover:opacity-90 transition-all shadow-brand active:scale-[0.97] active:shadow-inner"
        >
          Buy Now
        </button>
      </div>

      {/* Trust Badges Banner */}
      <div className="mt-4 pt-2">
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth sm:gap-2 pb-2 px-4 md:mx-0 md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="shrink-0 snap-center w-[160px] sm:w-[180px] md:w-auto flex flex-col items-center text-center">
            <Image src="/images/booking.png" alt="Place an Order" width={32} height={32} className="mb-2.5 drop-shadow-sm opacity-90 object-contain h-[32px]" />
            <p className="text-[14px] font-bold text-brand-text leading-tight">Place an Order</p>
            <p className="text-[11px] text-gray-500 mt-1">100% Checkout</p>
          </div>

          <div className="shrink-0 snap-center w-[160px] sm:w-[180px] md:w-auto flex flex-col items-center text-center">
            <Image src="/images/fast-delivery.png" alt="Fast Delivery" width={32} height={32} className="mb-2.5 drop-shadow-sm opacity-90 object-contain h-[32px]" />
            <p className="text-[14px] font-bold text-brand-text leading-tight">Fast Delivery</p>
            <p className="text-[11px] text-gray-500 mt-1">3-5 business days</p>
          </div>

          <div className="shrink-0 snap-center w-[160px] sm:w-[180px] md:w-auto flex flex-col items-center text-center">
            <Image src="/images/medal-.png" alt="Trusted by Experts" width={32} height={32} className="mb-2.5 drop-shadow-sm opacity-90 object-contain h-[32px]" />
            <p className="text-[13px] font-bold text-brand-text leading-tight">Trusted by Experts</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-tight">Preferred by Industry Professionals</p>
          </div>

        </div>
      </div>
    </div>
  );
}
