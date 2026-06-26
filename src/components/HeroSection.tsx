"use client";

import type { Clinic } from "@/types";

export default function HeroSection({ clinic }: { clinic: Clinic }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[92vh] px-6 text-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-rose-100/60 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        {/* Wordmark */}
        <p className="mb-4 text-xs tracking-[0.35em] uppercase text-rose-400 font-medium">
          Aesthetic Clinic · Dublin
        </p>

        <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-neutral-800 leading-tight">
          {clinic.name}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-500 font-light max-w-xl mx-auto leading-relaxed">
          Precision aesthetics. Natural results. A sanctuary where science meets
          beauty in the heart of Dublin.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-chat"));
            }}
            className="px-8 py-3.5 rounded-full bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition-colors"
          >
            Book a Treatment
          </button>
          <a
            href="#services"
            className="px-8 py-3.5 rounded-full border border-neutral-300 text-neutral-700 text-sm tracking-wide hover:bg-white/70 transition-colors"
          >
            View Services
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-400">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-neutral-300 animate-pulse" />
      </div>
    </section>
  );
}
