"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, ClipboardList } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { quantity } = useCart();
  const { user, signOut, openAuthModal } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const prevQuantityRef = useRef(quantity);

  useEffect(() => { setMounted(true); }, []);

  // Calculate dropdown position from the avatar button
  const updatePos = () => {
    if (!avatarBtnRef.current) return;
    const rect = avatarBtnRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  const openMenu = () => {
    updatePos();
    setUserMenuOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        avatarBtnRef.current && !avatarBtnRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [userMenuOpen]);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!userMenuOpen) return;
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userMenuOpen]);

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
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="md:hidden p-1.5 -ml-1.5 text-gray-700 hover:text-brand-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Luwia Skin Science"
                width={120}
                height={48}
                className="h-9 sm:h-10 md:h-12 w-auto"
                priority
              />
            </Link>
          </div>

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

          {/* Cart + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sign In / User Avatar */}
            {user ? (
              <div className="relative">
                <button
                  ref={avatarBtnRef}
                  id="navbar-user-menu-btn"
                  onClick={() => userMenuOpen ? setUserMenuOpen(false) : openMenu()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 hover:border-brand-primary/40 hover:bg-brand-bg transition-all"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)" }}
                  >
                    {user.email?.[0].toUpperCase() ?? <User className="w-3 h-3" />}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown via portal — escapes the sticky header stacking context */}
                {userMenuOpen && mounted && ReactDOM.createPortal(
                  <div
                    ref={dropdownRef}
                    style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right }}
                    className="w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-[9999]"
                  >
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/my-orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-colors"
                    >
                      <ClipboardList className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button
                      id="navbar-signout-btn"
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>,
                  document.body
                )}
              </div>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={openAuthModal}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full transition-all"
                style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)" }}
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
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/40 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <Image
            src="/images/logo.png"
            alt="Luwia Skin Science"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-500 hover:text-brand-primary transition-colors bg-gray-50 hover:bg-brand-bg rounded-full"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 mt-2 border-t border-gray-100 space-y-1">
            {user ? (
              <>
                <Link
                  href="/my-orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all duration-200"
                >
                  <ClipboardList className="w-5 h-5" />
                  My Orders
                </Link>
                <button
                  onClick={async () => { setMobileOpen(false); await signOut(); }}
                  className="w-full flex items-center gap-3 py-3 px-4 text-base font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                id="mobile-signin-btn"
                onClick={() => { setMobileOpen(false); openAuthModal(); }}
                className="w-full py-3.5 px-4 text-base font-bold text-white rounded-xl text-center shadow-md"
                style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)" }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
