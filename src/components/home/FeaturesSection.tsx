import { ShieldCheck, Heart, Award, Truck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "100% secure checkout",
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description: "No animal testing",
  },
  {
    icon: Award,
    title: "Trusted by Experts",
    description: "Preferred by industry professionals",
  },
  {
    icon: Truck,
    title: "Fast & Reliable",
    description: "Quick delivery you can count on",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(30,58,138,0.15)] hover:-translate-y-1 cursor-pointer bg-white hover:border-transparent border border-transparent"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light/10 text-brand-primary mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg">
                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
