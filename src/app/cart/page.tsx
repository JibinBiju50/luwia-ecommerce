"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCT } from "@/lib/product";

export default function CartPage() {
  const { quantity, updateQuantity } = useCart();

  if (quantity === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-brand-bg flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text mb-2">Your cart is empty</h1>
        <p className="text-gray-500 text-sm mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/product"
          className="px-8 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const onlineTotal = quantity * PRODUCT.onlinePrice;
  const codTotal = quantity * PRODUCT.codPrice;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-8">
          Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Item */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={PRODUCT.image}
                    alt={PRODUCT.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href="/product" className="text-sm font-semibold text-brand-text hover:text-brand-primary transition-colors line-clamp-2">
                    {PRODUCT.name}
                  </Link>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-text">
                      {PRODUCT.currencySymbol}{PRODUCT.onlinePrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {PRODUCT.currencySymbol}{PRODUCT.originalPrice}
                    </span>
                  </div>

                  {/* Free Delivery */}
                  <div className="mt-1 flex items-center gap-1 text-green-600">
                    <Truck className="w-3 h-3" />
                    <span className="text-xs font-medium">Free Delivery</span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(quantity - 1)}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(quantity + 1)}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        disabled={quantity >= PRODUCT.maxQuantity}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(0)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/product"
              className="inline-flex items-center mt-4 text-sm text-brand-primary hover:text-brand-dark font-medium transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-brand-bg/50 rounded-2xl p-6 border border-brand-primary/5 sticky top-24">
              <h2 className="text-lg font-semibold text-brand-text mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="font-medium">{PRODUCT.currencySymbol}{onlineTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-brand-primary/10 pt-3 flex justify-between">
                  <span className="font-semibold text-brand-text">Total</span>
                  <span className="font-bold text-lg text-brand-text">
                    {PRODUCT.currencySymbol}{onlineTotal}
                  </span>
                </div>
              </div>

              {/* Pay online hint */}
              <div className="mt-4 flex items-center gap-2 bg-brand-primary/5 px-3 py-2 rounded-lg">
                <CreditCard className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <p className="text-xs text-brand-dark">
                  Pay online to save <span className="font-semibold">{PRODUCT.currencySymbol}{quantity * (PRODUCT.codPrice - PRODUCT.onlinePrice)}</span>!
                </p>
              </div>

              {/* COD price reference */}
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                COD price: {PRODUCT.currencySymbol}{codTotal}
              </p>

              <Link
                href="/checkout"
                className="mt-5 block w-full py-3.5 text-sm font-semibold text-center text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
