import type { Clinic } from "@/types";

export default function FooterSection({ clinic }: { clinic: Clinic }) {
  return (
    <footer className="py-10 px-6 bg-neutral-900 text-neutral-400 text-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white font-light tracking-wide">{clinic.name}</p>
        <p>{clinic.location}</p>
        <p>
          <a href={`tel:${clinic.phone}`} className="hover:text-white transition-colors">
            {clinic.phone}
          </a>
        </p>
        <p className="text-neutral-600 text-xs">
          © {new Date().getFullYear()} {clinic.name}
        </p>
      </div>
    </footer>
  );
}
