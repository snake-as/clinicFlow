import type { Hours } from "@/types";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function HoursSection({
  hours,
  location,
  phone,
}: {
  hours: Hours;
  location: string;
  phone: string;
}) {
  return (
    <section id="hours" className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Opening Hours */}
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-rose-400 font-medium mb-3">
            Opening Hours
          </p>
          <h2 className="text-3xl font-light text-neutral-800 mb-8">
            When We&apos;re Open
          </h2>

          <ul className="space-y-3">
            {DAY_ORDER.map((day) => {
              const slot = hours[day];
              return (
                <li
                  key={day}
                  className="flex justify-between items-center text-sm border-b border-neutral-200 pb-3 last:border-0"
                >
                  <span className="text-neutral-600 font-medium w-28">{day}</span>
                  {slot ? (
                    <span className="text-neutral-800">
                      {slot.open} – {slot.close}
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic">Closed</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-rose-400 font-medium mb-3">
            Find Us
          </p>
          <h2 className="text-3xl font-light text-neutral-800 mb-8">
            Location &amp; Contact
          </h2>

          <div className="space-y-6 text-sm text-neutral-600">
            <div className="flex gap-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-medium text-neutral-800 mb-1">Address</p>
                <p className="leading-relaxed">{location}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg">📞</span>
              <div>
                <p className="font-medium text-neutral-800 mb-1">Phone</p>
                <a
                  href={`tel:${phone}`}
                  className="hover:text-rose-500 transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg">💬</span>
              <div>
                <p className="font-medium text-neutral-800 mb-1">Book Online</p>
                <p>Use our chat widget to book instantly, any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
