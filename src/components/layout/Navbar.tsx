"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { quantity } = useCart();
  const { user, signOut, openAuthModal } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [showPopup, setShowPopup] = useState(false);
  const prevQuantityRef = useRef(quantity);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* Cart + Auth + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sign In / User Avatar */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="navbar-user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 hover:border-brand-primary/40 hover:bg-brand-bg transition-all"
                  aria-label="User menu"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}>
                    {user.email?.[0].toUpperCase() ?? <User className="w-3 h-3" />}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button
                      id="navbar-signout-btn"
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={openAuthModal}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full transition-all"
                style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}
              >
                Sign In
              </button>
            )}

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
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
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
          {/* Sign In / Sign Out in mobile menu */}
          {user ? (
            <button
              onClick={async () => { setMobileOpen(false); await signOut(); }}
              className="w-full flex items-center gap-2 py-3 px-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button
              id="mobile-signin-btn"
              onClick={() => { setMobileOpen(false); openAuthModal(); }}
              className="w-full py-3 px-3 text-sm font-semibold text-white rounded-xl text-left"
              style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
