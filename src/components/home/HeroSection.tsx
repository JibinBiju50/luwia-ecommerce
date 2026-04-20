import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-bg to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center relative z-10">
        
        {/* Top Row: Image (Left) & Headline (Right) */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-10 mb-8 sm:mb-12 w-full max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] flex-shrink-0">
            {/* Decorative circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-light/30 to-brand-primary/10 blur-xl scale-110" />
            <Image
              src="/images/luwia_jar.png"
              alt="Luwia Pearl Radiance Cream"
              fill
              className="object-contain animate-float drop-shadow-xl relative z-10"
              priority
              sizes="(max-width: 640px) 140px, (max-width: 768px) 220px, 280px"
            />
          </div>

          {/* Headline */}
          <div className="text-left">
            <p className="text-brand-primary font-semibold text-xs sm:text-base tracking-widest uppercase mb-1 sm:mb-2">
              One Cream
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-text leading-tight">
              <span className="text-[#997bb3]">ENDLESS</span>
              <br />
              <span className="text-[#997bb3]">GLOW</span>
            </h1>
          </div>
        </div>

        {/* Text & CTA below */}
        <div className="text-center w-full max-w-2xl mx-auto">
          
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-12 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand sm:w-auto w-full"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-brand-light/10 blur-3xl" />
    </section>
  );
}
