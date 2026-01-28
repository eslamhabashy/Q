"use client";

import { MessageSquare, Brain, UserCheck } from "lucide-react";

interface HowItWorksSectionProps {
  language: "en" | "ar";
}

export function HowItWorksSection({ language }: HowItWorksSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      label: "How it works",
      title: "Get legal clarity in three simple steps",
      steps: [
        {
          number: "01",
          icon: MessageSquare,
          title: "Ask Your Question",
          description:
            "Describe your legal situation or question in plain language. No legal jargon required.",
        },
        {
          number: "02",
          icon: Brain,
          title: "Get AI Analysis",
          description:
            "Our AI analyzes your query against Egyptian law and provides relevant legal information and guidance.",
        },
        {
          number: "03",
          icon: UserCheck,
          title: "Connect with a Lawyer",
          description:
            "If you need professional representation, we'll connect you with a verified lawyer in your area.",
        },
      ],
    },
    ar: {
      label: "كيف يعمل",
      title: "احصل على وضوح قانوني في ثلاث خطوات بسيطة",
      steps: [
        {
          number: "01",
          icon: MessageSquare,
          title: "اطرح سؤالك",
          description:
            "صف موقفك القانوني أو سؤالك بلغة بسيطة. لا حاجة للمصطلحات القانونية.",
        },
        {
          number: "02",
          icon: Brain,
          title: "احصل على تحليل الذكاء الاصطناعي",
          description:
            "يقوم الذكاء الاصطناعي بتحليل استفسارك وفقاً للقانون المصري ويقدم المعلومات والإرشادات القانونية ذات الصلة.",
        },
        {
          number: "03",
          icon: UserCheck,
          title: "تواصل مع محامٍ",
          description:
            "إذا كنت بحاجة إلى تمثيل قانوني احترافي، سنربطك بمحامٍ موثق في منطقتك.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      className="bg-secondary px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
            {t.label}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
            {t.title}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {t.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Number Badge */}
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <step.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-secondary-foreground">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
