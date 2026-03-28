import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-bg to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center relative z-10">
        
        {/* Top Row: Image (Left) & Headline (Right) */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-10 mb-8 sm:mb-12 w-full max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] flex-shrink-0">
            {/* Decorative circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-light/30 to-brand-primary/10 blur-xl scale-110" />
            <Image
              src="/images/luwia_jar_single_crop.png"
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
          <div className="space-y-2 mb-8">
            <p className="text-lg sm:text-2xl md:text-3xl font-light text-gray-700">
              What if skincare was simpler?
            </p>
            <p className="text-base sm:text-xl text-gray-500 font-light flex items-center justify-center gap-2">
              See what simple feels like <span className="text-brand-primary text-xl">{`>`}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/product"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand sm:w-auto w-full"
            >
              Shop Now
            </Link>
            <Link
              href="#learn-more"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-brand-primary bg-white border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 transition-colors sm:w-auto w-full"
            >
              Learn More
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
