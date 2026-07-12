"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { PRODUCT as DEFAULT_PRODUCT } from "@/lib/product";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product?: Product | typeof DEFAULT_PRODUCT;
}

export default function ProductCard({ product = DEFAULT_PRODUCT }: ProductCardProps) {
  const { couponApplied, addToCart } = useCart();
  const { user, openMagicLinkModal, pendingCartAction } = useAuth();

  // If the product doesn't have an ID, it's the old default product.
  const productId = 'id' in product ? product.id : "default";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      pendingCartAction.current = () => addToCart(productId, 1);
      openMagicLinkModal();
      return;
    }
    addToCart(productId, 1);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-brand hover:shadow-brand-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      {/* Image */}
      <Link href={'id' in product ? `/products/${product.id}` : "/products"} className="block relative w-full">
        <div className="relative w-full h-44 sm:h-60 overflow-hidden">
          <Image
            src={product.cardImage}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 320px"
          />
          {/* Badge removed */}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link href={'id' in product ? `/products/${product.id}` : "/products"}>
          <h3 className="text-sm sm:text-base font-semibold text-brand-text line-clamp-2 hover:text-brand-primary transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
          <span className="text-lg sm:text-xl font-bold text-brand-text">
            {product.currencySymbol}{product.onlinePrice}
          </span>
          <span className="text-xs sm:text-sm text-gray-400 line-through">
            {product.currencySymbol}{product.originalPrice}
          </span>
        </div>

        {/* Free Delivery Badge */}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 text-green-600">
          <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[10px] sm:text-xs font-medium">Free Delivery</span>
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-3 sm:pt-4">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-brand-primary rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-[0.97] active:shadow-inner"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
