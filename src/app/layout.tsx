import type { Metadata } from "next";
import { DM_Sans, Inter, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import MagicLinkModal from "@/components/auth/MagicLinkModal";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X7RZV7XVK5"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X7RZV7XVK5');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NJVJ5NTC');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${dmSans.variable} ${inter.variable} ${nunito.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJVJ5NTC"
height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
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
      </body>
    </html>
  );
}
