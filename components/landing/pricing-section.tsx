"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingSectionProps {
  language: "en" | "ar";
}

export function PricingSection({ language }: PricingSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      label: "Pricing",
      title: "Choose the plan that fits your needs",
      subtitle:
        "Start for free, upgrade when you need more. All plans include access to our AI assistant.",
      monthly: "per month",
      popular: "Most Popular",
      cta: "Get Started",
      plans: [
        {
          name: "Free",
          price: "0",
          currency: "EGP",
          description: "Perfect for trying out our service",
          features: [
            "3 questions per month",
            "Basic legal information",
            "Common question topics",
            "Email support",
          ],
        },
        {
          name: "Basic",
          price: "50",
          currency: "EGP",
          description: "For individuals with regular legal questions",
          features: [
            "Unlimited questions",
            "Full Egyptian law coverage",
            "Conversation history",
            "Document templates",
            "Priority support",
          ],
          popular: true,
        },
        {
          name: "Premium",
          price: "150",
          currency: "EGP",
          description: "For those who need professional review",
          features: [
            "Everything in Basic",
            "Lawyer review of AI responses",
            "Direct lawyer consultation (1/month)",
            "Priority lawyer matching",
            "Export conversations as PDF",
            "24/7 phone support",
          ],
        },
      ],
    },
    ar: {
      label: "الأسعار",
      title: "اختر الخطة التي تناسب احتياجاتك",
      subtitle:
        "ابدأ مجاناً، وقم بالترقية عندما تحتاج المزيد. جميع الخطط تشمل الوصول لمساعدنا الذكي.",
      monthly: "شهرياً",
      popular: "الأكثر شعبية",
      cta: "ابدأ الآن",
      plans: [
        {
          name: "مجاني",
          price: "0",
          currency: "ج.م",
          description: "مثالي لتجربة خدمتنا",
          features: [
            "3 أسئلة شهرياً",
            "معلومات قانونية أساسية",
            "مواضيع الأسئلة الشائعة",
            "دعم عبر البريد الإلكتروني",
          ],
        },
        {
          name: "أساسي",
          price: "50",
          currency: "ج.م",
          description: "للأفراد ذوي الأسئلة القانونية المنتظمة",
          features: [
            "أسئلة غير محدودة",
            "تغطية كاملة للقانون المصري",
            "سجل المحادثات",
            "نماذج المستندات",
            "دعم أولوي",
          ],
          popular: true,
        },
        {
          name: "مميز",
          price: "150",
          currency: "ج.م",
          description: "لمن يحتاجون مراجعة احترافية",
          features: [
            "كل ما في الباقة الأساسية",
            "مراجعة المحامي لردود الذكاء الاصطناعي",
            "استشارة مباشرة مع محامٍ (1/شهر)",
            "مطابقة أولوية مع المحامين",
            "تصدير المحادثات كـ PDF",
            "دعم هاتفي على مدار الساعة",
          ],
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      id="pricing"
      className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
            {t.label}
          </p>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {t.plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col border-2 ${
                plan.popular
                  ? "border-accent shadow-lg shadow-accent/10"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  {t.popular}
                </Badge>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-card-foreground">
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-card-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    {plan.currency} / {t.monthly}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/chat">{t.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
