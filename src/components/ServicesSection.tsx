import type { Service } from "@/types";

const icons: Record<string, string> = {
  "Initial Consultation": "💬",
  "Anti-Wrinkle Injections (Botox)": "✨",
  "Dermal Filler": "💉",
  "Chemical Skin Peel": "🌿",
  "Laser Skin Resurfacing": "🔆",
  Microneedling: "🩺",
};

export default function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-rose-400 font-medium mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl font-light text-neutral-800">Our Treatments</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.name}
              className="group relative p-7 rounded-2xl border border-neutral-100 bg-stone-50 hover:bg-white hover:shadow-lg hover:border-rose-100 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{icons[service.name] ?? "✦"}</div>
              <h3 className="text-base font-semibold text-neutral-800 mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">
                  €{service.price}
                </span>
                <span className="text-neutral-400">{service.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
