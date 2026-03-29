"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Minus, Plus, Truck, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCT } from "@/lib/product";

export default function ProductInfo() {
  const [selectedQty, setSelectedQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const { addToCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Automatically clear the cart when they return to the product page
  // so abandoned checkouts don't leave lingering cart items.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleAddToCart = () => {
    addToCart(selectedQty);
  };

  const handleBuyNow = () => {
    // Overwrite the cart with the exact selected quantity before checkout
    updateQuantity(selectedQty);
    router.push("/checkout");
  };

  const handleShare = async () => {
    const shareData = {
      title: PRODUCT.name,
      text: PRODUCT.shortDescription,
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
  const incrementQty = () => setSelectedQty((q) => Math.min(PRODUCT.maxQuantity, q + 1));

  return (
    <div className="space-y-5">
      {/* Title + Wishlist */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text leading-tight">
            {PRODUCT.name}
          </h1>
          {/* Star rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-400/30 text-amber-400/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(2842)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-brand-text">
          {PRODUCT.currencySymbol}{PRODUCT.onlinePrice}
        </span>
        <span className="text-lg text-gray-400 line-through">
          {PRODUCT.currencySymbol}{PRODUCT.originalPrice}
        </span>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          Save {PRODUCT.currencySymbol}{PRODUCT.originalPrice - PRODUCT.onlinePrice}
        </span>
      </div>

      {/* Free Delivery */}
      <div className="flex items-center gap-2 text-green-600 bg-green-50/50 px-4 py-2.5 rounded-xl">
        <Truck className="w-4 h-4" />
        <span className="text-sm font-medium">Free Delivery</span>
        <span className="text-xs text-gray-500 ml-1">• 3–7 business days</span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
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
            disabled={selectedQty >= PRODUCT.maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3.5 text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all"
        >
          Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
        >
          Buy Now
        </button>
      </div>

      {/* Short description */}
      <p className="text-sm text-gray-500 leading-relaxed pt-2">
        {PRODUCT.shortDescription}
      </p>
    </div>
  );
}
