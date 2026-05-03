import { Droplet, Sparkles, Sun, ShieldCheck, Feather, Leaf } from "lucide-react";

const features = [
  {
    icon: Droplet,
    title: "DEEPLY HYDRATES",
    subtitle: "Locks in moisture all night",
  },
  {
    icon: Sparkles,
    title: "BRIGHTENS TONE",
    subtitle: "Reduces dark spots & pigmentation",
  },
  {
    icon: Sun,
    title: "REDUCES DULLNESS",
    subtitle: "Wakes you up with a natural glow",
  },
  {
    icon: ShieldCheck,
    title: "REPAIRS BARRIER",
    subtitle: "Heals and protects skin overnight",
  },
  {
    icon: Feather,
    title: "NON-GREASY",
    subtitle: "Lightweight and absorbs quickly",
  },
  {
    icon: Leaf,
    title: "CLEAN INGREDIENTS",
    subtitle: "Safe, proven & effective formula",
  },
];

export default function ProductFeatures() {
  return (
    <div className="w-full bg-[#FDFBF7] py-12 md:py-16 my-12 rounded-3xl border border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-text mb-10 md:mb-14">
          The Luwia Advantage
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary transition-transform hover:scale-110 duration-300">
                  <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-brand-text mb-2 uppercase tracking-wide text-center">
                  {feature.title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 text-center leading-relaxed max-w-[140px]">
                  {feature.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
