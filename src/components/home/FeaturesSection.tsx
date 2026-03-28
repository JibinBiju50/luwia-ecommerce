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
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-bg text-brand-primary mb-4 group-hover:shadow-brand transition-shadow duration-300">
                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-brand-text">
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
