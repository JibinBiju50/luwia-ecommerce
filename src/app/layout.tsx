import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
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
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WJRRDLNQ');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJRRDLNQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
