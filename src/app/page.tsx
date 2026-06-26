import { supabaseAdmin } from "@/lib/supabase/server";
import type { Clinic } from "@/types";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HoursSection from "@/components/HoursSection";
import FooterSection from "@/components/FooterSection";

export const revalidate = 60;

async function getClinic(): Promise<Clinic> {
  const { data, error } = await supabaseAdmin
    .from("clinics")
    .select("*")
    .eq("name", "Aurora Aesthetics")
    .single();

  if (error || !data) throw new Error("Clinic not found");
  return data as Clinic;
}

export default async function HomePage() {
  const clinic = await getClinic();

  return (
    <main className="flex flex-col min-h-screen bg-white text-neutral-900">
      <HeroSection clinic={clinic} />
      <ServicesSection services={clinic.services} />
      <HoursSection hours={clinic.hours} location={clinic.location} phone={clinic.phone} />
      <FooterSection clinic={clinic} />
    </main>
  );
}
