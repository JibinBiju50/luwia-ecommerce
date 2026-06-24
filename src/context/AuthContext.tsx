"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  // Magic link modal — product page popup
  showMagicLinkModal: boolean;
  openMagicLinkModal: () => void;
  closeMagicLinkModal: () => void;
  // Full auth modal — navbar sign-in button
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Pending cart action — fires after sign-in
  pendingCartAction: React.MutableRefObject<(() => void) | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Stores an add-to-cart fn that fires automatically after sign-in
  const pendingCartAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clean up stale Supabase auth data from localStorage.
    // The old createClient stored sessions in localStorage; the new
    // cookie-based createBrowserClient no longer uses it.
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-") && key.includes("-auth-token")) {
          localStorage.removeItem(key);
        }
      });
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Fire any pending cart action once the user signs in
      if (session?.user && pendingCartAction.current) {
        pendingCartAction.current();
        pendingCartAction.current = null;
        // Close both modals
        setShowMagicLinkModal(false);
        setShowAuthModal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const openMagicLinkModal = useCallback(() => setShowMagicLinkModal(true), []);
  const closeMagicLinkModal = useCallback(
    () => setShowMagicLinkModal(false),
    []
  );
  const openAuthModal = useCallback(() => setShowAuthModal(true), []);
  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        showMagicLinkModal,
        openMagicLinkModal,
        closeMagicLinkModal,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        pendingCartAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
