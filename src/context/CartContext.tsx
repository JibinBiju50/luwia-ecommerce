"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { PRODUCT } from "@/lib/product";
import { supabase } from "@/lib/supabase-client";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  quantity: number; // Total quantity of all items
  couponApplied: boolean;
  applyCoupon: () => void;
  removeCoupon: () => void;
  addToCart: (productId: string, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getOnlineTotal: () => number;
  getCodTotal: () => number;
  getProductDetails: (productId: string) => Product | typeof PRODUCT | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "luwia-cart-v2";

// Helper to find a product by ID
const findProduct = (id: string) => {
  // Check the new PRODUCTS list
  const found = PRODUCTS.find((p) => p.id === id);
  if (found) return found;
  // Fallback to legacy PRODUCT if someone uses "luwia-cream" or similar
  if (id === "luwia-cream" || id === "default") {
    // we can return PRODUCT but map it slightly so it looks similar
    return { ...PRODUCT, id: "default" };
  }
  return undefined;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      // First try the new storage key
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
        if (typeof parsed.couponApplied === "boolean") {
          setCouponApplied(parsed.couponApplied);
        }
      } else {
        // Fallback: migrate from old cart
        const oldStored = localStorage.getItem("luwia-cart");
        if (oldStored) {
          const parsed = JSON.parse(oldStored);
          if (typeof parsed.quantity === "number" && parsed.quantity > 0) {
            setItems([{ productId: "default", quantity: parsed.quantity }]);
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, couponApplied }));
    }
  }, [items, couponApplied, hydrated]);

  // Clear cart on sign-out
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setItems([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const addToCart = useCallback((productId: string, qty: number = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productId === productId);
      if (existing) {
        return prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + qty, 10) }
            : item
        );
      }
      return [...prevItems, { productId, quantity: Math.min(qty, 10) }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setItems((prevItems) => {
      if (qty <= 0) {
        return prevItems.filter((item) => item.productId !== productId);
      }
      return prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(qty, 10) } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyCoupon = useCallback(() => setCouponApplied(true), []);
  const removeCoupon = useCallback(() => setCouponApplied(false), []);

  const getOnlineTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const product = findProduct(item.productId);
      if (!product) return total;
      const price = couponApplied ? product.onlinePrice : product.originalPrice;
      return total + (price * item.quantity);
    }, 0);
  }, [items, couponApplied]);

  const getCodTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const product = findProduct(item.productId);
      if (!product) return total;
      const price = couponApplied ? product.codPrice : product.originalPrice + 70;
      return total + (price * item.quantity);
    }, 0);
  }, [items, couponApplied]);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        quantity: totalQuantity,
        couponApplied,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateQuantity,
        clearCart,
        getOnlineTotal,
        getCodTotal,
        getProductDetails: findProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
