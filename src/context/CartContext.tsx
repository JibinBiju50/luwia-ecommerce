"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCT } from "@/lib/product";

interface CartContextType {
  quantity: number;
  addToCart: (qty?: number) => void;
  updateQuantity: (qty: number) => void;
  clearCart: () => void;
  getOnlineTotal: () => number;
  getCodTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "luwia-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantity, setQuantity] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.quantity === "number" && parsed.quantity > 0) {
          setQuantity(Math.min(parsed.quantity, PRODUCT.maxQuantity));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantity }));
    }
  }, [quantity, hydrated]);

  const addToCart = useCallback(
    (qty: number = 1) => {
      setQuantity((prev) => Math.min(prev + qty, PRODUCT.maxQuantity));
    },
    []
  );

  const updateQuantity = useCallback((qty: number) => {
    setQuantity(Math.max(0, Math.min(qty, PRODUCT.maxQuantity)));
  }, []);

  const clearCart = useCallback(() => {
    setQuantity(0);
  }, []);

  const getOnlineTotal = useCallback(() => {
    return quantity * PRODUCT.onlinePrice;
  }, [quantity]);

  const getCodTotal = useCallback(() => {
    return quantity * PRODUCT.codPrice;
  }, [quantity]);

  return (
    <CartContext.Provider
      value={{ quantity, addToCart, updateQuantity, clearCart, getOnlineTotal, getCodTotal }}
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
