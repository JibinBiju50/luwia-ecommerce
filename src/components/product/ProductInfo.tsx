"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Truck, Star, Flame, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { addToCart as fbAddToCart, initiateCheckout } from "@/lib/fbpixel";
import PincodeChecker from "./PincodeChecker";
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [showMobileBuyNow, setShowMobileBuyNow] = useState(false);
  const { addToCart, couponApplied, applyCoupon } = useCart();
  const { user, openMagicLinkModal, pendingCartAction: pendingCartActionRef } = useAuth();
  const router = useRouter();
  const ingredientsScrollRef = useRef<HTMLDivElement>(null);
  const actionButtonsRef = useRef<HTMLDivElement>(null);

  const reviewCount = totalCount;
  const rating = avgRating;

  useEffect(() => {
    // Instantly apply coupon when page opens
    if (!couponApplied) {
      applyCoupon();
    }
  }, [couponApplied, applyCoupon]);

  useEffect(() => {
    const actionObserver = new IntersectionObserver(
      ([entry]) => {
        // Show the sticky bar if the original action buttons have scrolled past the top of the viewport
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { root: null, threshold: 0, rootMargin: "0px" }
    );

    if (actionButtonsRef.current) {
      actionObserver.observe(actionButtonsRef.current);
    }

    const footer = document.querySelector("footer");
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px" }
    );
    if (footer) {
      footerObserver.observe(footer);
    }

    return () => {
      actionObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

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
    setShowMobileBuyNow(true);
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

      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {/* Price */}
        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-3xl font-bold text-brand-text">
            {product.currencySymbol}{product.onlinePrice}
          </span>
          <span className="text-lg text-gray-400 line-through">
            {product.currencySymbol}{product.originalPrice}
          </span>
        </div>

        {/* Coupon Inline */}
        {!couponApplied ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-brand-primary">LUWIAGLOW53</span>
            <button
              onClick={applyCoupon}
              className="text-[10px] sm:text-xs font-bold text-white bg-brand-primary px-2 py-1 rounded shadow-sm hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl animate-bounce">🎉</span>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-sm font-bold text-green-700 leading-tight">LUWIAGLOW24 Applied!</span>
              <span className="text-[9px] sm:text-xs text-green-600 leading-tight">You got a 24% discount</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs md:text-sm text-gray-600 leading-relaxed mt-4">
        Glass skin begins tonight. Advanced brightening actives meet deep overnight hydration for smoother, healthier, more luminous skin by morning. Perfect for all skin types
      </p>

      

      {/* Action Buttons */}
      <div ref={actionButtonsRef} className="flex flex-col gap-3 pt-2">
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

      <PincodeChecker />

      {/* Helps With */}
      {product.id !== "luwia-core" && (
        <div className="mt-6 pt-5 border-t border-gray-100 relative group">
          <h3 className="text-sm font-bold text-brand-text mb-4">Helps with</h3>
          <div className="flex justify-around sm:justify-center gap-4 sm:gap-8 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { src: "/images/tan_repair.png", name: "Tan repair & even tone" },
              { src: "/images/brightening.jpg", name: "Brightening & glow" },
              { src: "/images/Hydration.png", name: "Hydration & barrier support" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-shrink-0 w-[28%] max-w-[100px]">
                <div className="relative w-full aspect-square rounded-full overflow-hidden border border-gray-100 mb-2 shadow-sm bg-white">
                  <Image src={item.src} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 30vw, 15vw" />
                </div>
                <span className="text-[10px] sm:text-[11px] text-center font-semibold text-gray-700 leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Ingredients */}
      <div className="mt-4 pt-2.5 border-t border-gray-100 relative group">
        <h3 className="text-sm font-bold text-brand-text mb-4">Hero Ingredients</h3>
        <div 
          ref={ingredientsScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        >
          {[
            { src: "/images/niacinamide.png", name: "Niacinamide" },
            { src: "/images/shea_butter.png", name: "Shea Butter" },
            { src: "/images/alpha_arbutin.png", name: "Alpha Arbutin" },
            { src: "/images/licorie_extract.png", name: "Licorice Extract" },
            { src: "/images/kojic_acid.png", name: "Kojic Acid" },
            { src: "/images/glutathione.png", name: "Glutathione" }
          ].map((ingredient, idx) => (
            <div key={idx} className="flex flex-col items-center flex-shrink-0 snap-center w-[22%]">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border border-gray-100 mb-2 shadow-sm bg-white">
                <Image src={ingredient.src} alt={ingredient.name} fill className="object-cover" sizes="(max-width: 768px) 25vw, 15vw" />
              </div>
              <span className="text-[9px] sm:text-[11px] text-center font-semibold text-gray-700 leading-tight">
                {ingredient.name}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Arrows for Large Screens */}
        <button
          type="button"
          className="hidden md:flex absolute top-[60%] -translate-y-1/2 -left-4 w-8 h-8 items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
          onClick={(e) => {
            e.stopPropagation();
            if (ingredientsScrollRef.current) {
              ingredientsScrollRef.current.scrollBy({ left: -ingredientsScrollRef.current.clientWidth / 2, behavior: "smooth" });
            }
          }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="hidden md:flex absolute top-[60%] -translate-y-1/2 -right-4 w-8 h-8 items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
          onClick={(e) => {
            e.stopPropagation();
            if (ingredientsScrollRef.current) {
              ingredientsScrollRef.current.scrollBy({ left: ingredientsScrollRef.current.clientWidth / 2, behavior: "smooth" });
            }
          }}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Trust Badges Banner */}
      <div className="mt-3 pt-4 border-t border-gray-100 overflow-hidden relative -mx-4 md:mx-0">
        <div className="flex w-max md:w-full gap-8 md:gap-4 md:grid md:grid-cols-3 animate-[scroll_12s_linear_infinite] md:animate-none hover:[animation-play-state:paused] md:hover:[animation-play-state:running]">
          
          {[
            { img: "/images/booking.png", title: "Place an Order", desc: "100% Checkout" },
            { img: "/images/fast-delivery.png", title: "Fast Delivery", desc: "2-5 business days" },
            { img: "/images/medal-.png", title: "Trusted by Experts", desc: "Preferred by Industry Professionals" }
          ].flatMap((badge, index) => [
            { ...badge, uniqueKey: `badge-1-${index}`, isDuplicate: false },
            { ...badge, uniqueKey: `badge-2-${index}`, isDuplicate: true }
          ]).sort((a, b) => (a.isDuplicate ? 1 : 0) - (b.isDuplicate ? 1 : 0)).map((badge) => (
            <div 
              key={badge.uniqueKey}
              className={`w-[180px] md:w-auto flex-col items-center text-center p-3] ${badge.isDuplicate ? 'flex md:hidden' : 'flex'}`}
            >
              <Image src={badge.img} alt={badge.title} width={32} height={32} className="mb-2.5 drop-shadow-sm opacity-90 object-contain h-[32px]" />
              <p className="text-[13px] font-bold text-brand-text leading-tight">{badge.title}</p>
              <p className="text-[11px] text-gray-500 mt-1">{badge.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)] p-3 md:p-4 z-50 transition-transform duration-300 ease-in-out ${
          showStickyBar && !isFooterVisible ? "translate-y-0" : "translate-y-[120%]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Optional: Small Product Info on Desktop */}
          <div className="hidden lg:flex items-center gap-3">
             <div className="relative w-12 h-12 rounded bg-brand-bg overflow-hidden shrink-0">
               <Image src={product.image} alt={product.name} fill className="object-cover" />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-sm text-brand-text truncate max-w-[200px]">{product.name}</span>
               <span className="font-semibold text-brand-primary text-sm">{product.currencySymbol}{product.onlinePrice}</span>
             </div>
          </div>
          
          <div className="flex flex-1 lg:flex-none items-center w-full lg:w-auto">
            
            {/* Desktop View: Always shows all three side-by-side */}
            <div className="hidden sm:flex items-center gap-3 w-full">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shrink-0 h-[48px]">
                <button
                  onClick={decrementQty}
                  className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                  disabled={selectedQty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold min-w-[24px] text-center">
                  {selectedQty}
                </span>
                <button
                  onClick={incrementQty}
                  className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                  disabled={selectedQty >= product.maxQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 lg:w-[160px] h-[48px] text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all active:scale-[0.97]"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 lg:w-[160px] h-[48px] text-sm font-bold text-white gradient-brand rounded-full hover:opacity-90 transition-all shadow-brand active:scale-[0.97]"
              >
                Buy Now
              </button>
            </div>

            {/* Mobile View: Toggles between Add to Cart + Qty OR Buy Now */}
            <div className="flex sm:hidden w-full relative h-[48px] overflow-hidden">
                {/* Quantity + Add to Cart container */}
                <div 
                  className={`absolute inset-0 flex items-center gap-2 w-full transition-all duration-300 ease-in-out ${
                    showMobileBuyNow ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"
                  }`}
                >
                   {/* Quantity */}
                   <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shrink-0 h-[48px]">
                     <button
                        onClick={decrementQty}
                        className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        disabled={selectedQty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold min-w-[24px] text-center">
                        {selectedQty}
                      </span>
                      <button
                        onClick={incrementQty}
                        className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        disabled={selectedQty >= product.maxQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>
                   
                   {/* Add to Cart */}
                   <button
                    onClick={handleAddToCart}
                    className="flex-1 h-[48px] text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all active:scale-[0.97]"
                   >
                    Add to Cart
                   </button>
                </div>

                {/* Buy Now container */}
                <div 
                  className={`absolute inset-0 flex items-center w-full transition-all duration-300 ease-in-out ${
                    showMobileBuyNow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
                  }`}
                >
                   <button
                    onClick={handleBuyNow}
                    className="w-full h-[48px] text-sm font-bold text-white gradient-brand rounded-full hover:opacity-90 transition-all shadow-brand active:scale-[0.97]"
                   >
                    Buy Now
                   </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
