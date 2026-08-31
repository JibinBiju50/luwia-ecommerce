import type { Metadata } from "next";
import { DM_Sans, Inter, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import MagicLinkModal from "@/components/auth/MagicLinkModal";

import { PIXEL_ID } from "@/lib/fbpixel";
import DelayedScripts from "@/components/layout/DelayedScripts";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["600", "700", "800"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Luwia Skin Science — Pearl Radiance Cream | Skin Bright & Repair",
  description:
    "Reveal radiant, healthy skin with Luwia Cream. Powered by Niacinamide, Glutathione & Shea Butter. Brightens, hydrates, and restores your natural glow. Free delivery across India.",
  keywords: [
    "Luwia",
    "skin cream",
    "brightening cream",
    "niacinamide cream",
    "glutathione cream",
    "skincare India",
    "pearl radiance cream",
  ],
  openGraph: {
    title: "Luwia Skin Science — Pearl Radiance Cream",
    description:
      "Crafted for Indian skin. Glass skin formula with Niacinamide, Glutathione & Shea Butter.",
    type: "website",
    images: [
      {
        url: "/images/product_link_img.jpeg",
        width: 1200,
        height: 630,
        alt: "Luwia Skin Science",
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${dmSans.variable} ${inter.variable} ${nunito.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KNP53497"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}

        <DelayedScripts />

        <AuthProvider>
          <CartProvider>
            <NextTopLoader
              color="#1E3A8A"
              height={3}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <AuthModal />
            <MagicLinkModal />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
