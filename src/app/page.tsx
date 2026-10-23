import { AboutSection } from "@/components/sections/AboutSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { HowIThinkSection } from "@/components/sections/HowIThinkSection";
import { PerformanceSection } from "@/components/sections/PerformanceSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SelectedWorkSection />
      <CapabilitiesSection />
      <PerformanceSection />
      <HowIThinkSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
