"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowRight, Shield, Clock, FileText } from "lucide-react";

interface HeroSectionProps {
  language: "en" | "ar";
}

export function HeroSection({ language }: HeroSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      badge: "AI-Powered Legal Guidance",
      headline: "Get Legal Guidance in Minutes",
      subheadline:
        "Understand your rights under Egyptian law with AI-powered legal information. Available 24/7 for common legal matters.",
      cta: "Ask Your Legal Question",
      secondary: "View Document Templates",
      disclaimer:
        "Educational purposes only - not a replacement for licensed legal counsel",
      stats: {
        questions: "50K+ Questions Answered",
        users: "10K+ Users Trust Us",
        availability: "24/7 Available",
      },
    },
    ar: {
      badge: "إرشادات قانونية بالذكاء الاصطناعي",
      headline: "احصل على إرشادات قانونية في دقائق",
      subheadline:
        "افهم حقوقك بموجب القانون المصري مع المعلومات القانونية المدعومة بالذكاء الاصطناعي. متاح على مدار الساعة للمسائل القانونية الشائعة.",
      cta: "اطرح سؤالك القانوني",
      secondary: "عرض نماذج المستندات",
      disclaimer:
        "للأغراض التعليمية فقط - لا يُعد بديلاً عن الاستشارة القانونية المرخصة",
      stats: {
        questions: "+50 ألف سؤال تمت الإجابة عليه",
        users: "+10 آلاف مستخدم يثقون بنا",
        availability: "متاح 24/7",
      },
    },
  };

  const t = content[language];

  return (
    <section
      className="relative overflow-hidden bg-primary px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 bg-accent/20 text-accent hover:bg-accent/30"
          >
            <Scale className="mr-2 h-3 w-3" />
            {t.badge}
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            {t.headline}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-primary-foreground/80 sm:text-xl">
            {t.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
              asChild
            >
              <Link href="/chat">
                {t.cta}
                <ArrowRight className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-4 w-4`} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              asChild
            >
              <Link href="/templates">
                <FileText className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t.secondary}
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
            <Shield className="h-4 w-4" />
            {t.disclaimer}
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">50K+</div>
            <div className="mt-1 text-sm text-primary-foreground/70">
              {t.stats.questions}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">10K+</div>
            <div className="mt-1 text-sm text-primary-foreground/70">
              {t.stats.users}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold text-accent">
              <Clock className="h-6 w-6" />
              24/7
            </div>
            <div className="mt-1 text-sm text-primary-foreground/70">
              {t.stats.availability}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
