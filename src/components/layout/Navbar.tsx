"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { quantity } = useCart();

  const [showPopup, setShowPopup] = useState(false);
  const prevQuantityRef = useRef(quantity);

  useEffect(() => {
    if (quantity > prevQuantityRef.current) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 2500);
      prevQuantityRef.current = quantity;
      return () => clearTimeout(timer);
    }
    prevQuantityRef.current = quantity;
  }, [quantity]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Luwia Skin Science"
              width={120}
              height={48}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-brand-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {quantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {quantity}
                </span>
              )}

              {/* Item Added Popup */}
              {showPopup && (
                <div className="absolute top-full mt-3 right-0 bg-brand-text text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in-up before:content-[''] before:absolute before:-top-1 before:right-3 before:w-2.5 before:h-2.5 before:bg-brand-text before:rotate-45">
                  Item added to cart!
                </div>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-700 hover:text-brand-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 pb-4 space-y-1 bg-white/95 backdrop-blur-lg border-t border-brand-primary/10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-3 text-sm font-medium text-gray-700 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
