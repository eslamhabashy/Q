"use client";

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isDark={theme === "dark"}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main>
        <HeroSection language={language} />
        <FeaturesSection language={language} />
        <HowItWorksSection language={language} />
        <PricingSection language={language} />
        <TestimonialsSection language={language} />
        <FAQSection language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}
