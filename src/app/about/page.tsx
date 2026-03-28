export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand-primary tracking-widest uppercase mb-3">
            Our Story
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            ✨ About Luwia
          </h1>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none text-gray-600 space-y-6">
          <p className="text-lg leading-relaxed">
            At Luwia, we believe skincare should be simple, effective, and truly transformative.
            Our philosophy is rooted in blending science-backed ingredients with gentle formulations
            to deliver visible results without compromising skin health.
          </p>

          <p>
            Every Luwia product is thoughtfully crafted using proven actives like Niacinamide and
            Glutathione, combined with deeply nourishing elements such as Shea Butter and Squalane
            — working in harmony to brighten, hydrate, and restore your skin&apos;s natural balance.
          </p>

          <p>
            We focus on real results over trends, creating formulations that target tan, uneven tone,
            and dullness, while strengthening and protecting your skin barrier for long-term glow.
          </p>

          {/* Our Promise */}
          <div className="bg-brand-bg/50 rounded-2xl p-6 md:p-8 my-8">
            <h2 className="text-xl font-bold text-brand-text mb-4">🌿 Our Promise</h2>
            <ul className="space-y-3">
              {[
                "Thoughtfully selected, skin-loving ingredients",
                "Safe, effective, and suitable for daily use",
                "Lightweight, non-greasy formulations",
                "Visible results with consistent care",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Vision */}
          <div className="bg-gradient-to-r from-brand-bg to-brand-light/20 rounded-2xl p-6 md:p-8 my-8">
            <h2 className="text-xl font-bold text-brand-text mb-4">💎 Our Vision</h2>
            <p className="text-gray-600">
              To redefine everyday skincare by making radiant, healthy skin accessible, effortless, and reliable.
            </p>
          </div>

          <p className="text-center text-lg font-semibold text-brand-primary mt-8">
            Luwia — Where science meets glow.
          </p>
        </div>
      </div>
    </div>
  );
}
