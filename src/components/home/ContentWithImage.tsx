import Image from "next/image";

export default function ContentWithImage() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-[180px] md:max-w-[240px] h-[180px] md:h-[240px] rounded-2xl overflow-hidden">
            <Image
              src="/images/luwia_men_crop.png"
              alt="Luwia Pearl Radiance Cream with packaging"
              fill
              className="object-contain drop-shadow-xl animate-float"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-sm font-medium text-brand-primary tracking-widest uppercase">
              What&apos;s Inside
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              With
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "Glutathione",
                  desc: "Targets tan & pigmentation for luminous skin",
                },
                {
                  name: "Niacinamide",
                  desc: "Refines pores & fades dark spots",
                },
                {
                  name: "Licorice Extract and Shea Butter",
                  desc: "Brightens, soothes & deeply nourishes",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-brand-bg/60 rounded-xl p-4 border border-brand-primary/5"
                >
                  <h3 className="font-semibold text-brand-text">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                Powered by clinical trusted activities
              </p>
              <p className="text-sm text-gray-500">
                Formulated for calm, clear and hydrated skin
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
