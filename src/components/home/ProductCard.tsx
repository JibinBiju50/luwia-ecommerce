"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCT } from "@/lib/product";
import { useRouter } from "next/navigation";

export default function ProductCard() {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart(1);
    router.push("/checkout");
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-text mb-12">
          Best Selling Product
        </h2>

        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden shadow-brand hover:shadow-brand-lg transition-shadow duration-300">
            {/* Image */}
            <Link href="/product" className="block relative">
              <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
                <Image
                  src={PRODUCT.cardImage}
                  alt={PRODUCT.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 384px"
                />
                {/* Glass skin tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
                  GLASS SKIN FORMULA
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="p-5">
              <Link href="/product">
                <h3 className="text-base font-semibold text-brand-text line-clamp-2 hover:text-brand-primary transition-colors">
                  {PRODUCT.name}
                </h3>
              </Link>

              {/* Price */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xl font-bold text-brand-text">
                  {PRODUCT.currencySymbol}{PRODUCT.onlinePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {PRODUCT.currencySymbol}{PRODUCT.originalPrice}
                </span>
              </div>

              {/* Free Delivery Badge */}
              <div className="mt-2 flex items-center gap-1.5 text-green-600">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Free Delivery</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                {PRODUCT.shortDescription}
              </p>

              {/* Buttons */}
              <div className="mt-5">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
