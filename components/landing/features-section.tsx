"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Scale,
  Wallet,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";

interface FeaturesSectionProps {
  language: "en" | "ar";
}

export function FeaturesSection({ language }: FeaturesSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      label: "What we do",
      title: "Legal guidance made accessible for everyone",
      subtitle:
        "Our AI-powered platform helps you understand Egyptian law and navigate common legal matters with confidence.",
      features: [
        {
          icon: Clock,
          title: "24/7 Availability",
          description:
            "Get answers to your legal questions anytime, anywhere. Our AI assistant never sleeps.",
        },
        {
          icon: Scale,
          title: "Egyptian Law Expertise",
          description:
            "Specialized knowledge of Egyptian civil, criminal, family, and labor laws.",
        },
        {
          icon: Wallet,
          title: "Affordable Pricing",
          description:
            "Access legal information at a fraction of traditional consultation costs.",
        },
        {
          icon: FileText,
          title: "Document Templates",
          description:
            "Ready-to-use legal document templates for common agreements and contracts.",
        },
        {
          icon: MessageSquare,
          title: "Clear Explanations",
          description:
            "Complex legal concepts explained in simple, easy-to-understand language.",
        },
        {
          icon: Users,
          title: "Lawyer Network",
          description:
            "Connect with verified lawyers when you need professional legal representation.",
        },
      ],
    },
    ar: {
      label: "ما نقدمه",
      title: "إرشادات قانونية متاحة للجميع",
      subtitle:
        "منصتنا المدعومة بالذكاء الاصطناعي تساعدك على فهم القانون المصري والتعامل مع المسائل القانونية الشائعة بثقة.",
      features: [
        {
          icon: Clock,
          title: "متاح على مدار الساعة",
          description:
            "احصل على إجابات لأسئلتك القانونية في أي وقت وأي مكان. مساعدنا الذكي لا ينام أبداً.",
        },
        {
          icon: Scale,
          title: "خبرة في القانون المصري",
          description:
            "معرفة متخصصة بالقانون المدني والجنائي والأسري والعمل المصري.",
        },
        {
          icon: Wallet,
          title: "أسعار معقولة",
          description:
            "احصل على المعلومات القانونية بجزء بسيط من تكلفة الاستشارات التقليدية.",
        },
        {
          icon: FileText,
          title: "نماذج المستندات",
          description:
            "نماذج مستندات قانونية جاهزة للاستخدام للاتفاقيات والعقود الشائعة.",
        },
        {
          icon: MessageSquare,
          title: "شروحات واضحة",
          description:
            "المفاهيم القانونية المعقدة موضحة بلغة بسيطة وسهلة الفهم.",
        },
        {
          icon: Users,
          title: "شبكة المحامين",
          description:
            "تواصل مع محامين موثقين عندما تحتاج إلى تمثيل قانوني احترافي.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      id="features"
      className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
            {t.label}
          </p>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent/20 group-hover:text-accent">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
