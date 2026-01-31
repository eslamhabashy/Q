"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingSectionProps {
  language: "en" | "ar";
}

export function PricingSection({ language }: PricingSectionProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
      ctaPaid: "Subscribe Now",
      plans: [
        {
          name: "Free",
          price: "0",
          currency: "EGP",
          description: "Try our service with demo mode",
          features: [
            "3 demo questions (no signup)",
            "Basic legal information",
            "Common question topics",
          ],
          href: "/chat",
        },
        {
          name: "Basic",
          price: "100",
          currency: "EGP",
          description: "For individuals with regular legal questions",
          features: [
            "10 questions per day",
            "Full Egyptian law coverage",
            "Conversation history",
            "Document templates",
            "Priority support",
          ],
          popular: true,
          tier: "basic",
        },
        {
          name: "Pro",
          price: "300",
          currency: "EGP",
          description: "For power users who need more",
          features: [
            "50 questions per day",
            "Everything in Basic",
            "Connect with lawyers",
            "Priority AI responses",
            "Export conversations as PDF",
          ],
          tier: "pro",
        },
        {
          name: "Premium",
          price: "600",
          currency: "EGP",
          description: "For those who need professional support",
          features: [
            "Unlimited questions",
            "Everything in Pro",
            "Lawyer review of responses",
            "Direct lawyer consultation (1/month)",
            "24/7 premium support",
          ],
          tier: "premium",
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
      ctaPaid: "اشترك الآن",
      plans: [
        {
          name: "مجاني",
          price: "0",
          currency: "ج.م",
          description: "جرب خدمتنا في الوضع التجريبي",
          features: [
            "3 أسئلة تجريبية (بدون تسجيل)",
            "معلومات قانونية أساسية",
            "مواضيع الأسئلة الشائعة",
          ],
          href: "/chat",
        },
        {
          name: "أساسي",
          price: "100",
          currency: "ج.م",
          description: "للأفراد ذوي الأسئلة القانونية المنتظمة",
          features: [
            "10 أسئلة يومياً",
            "تغطية كاملة للقانون المصري",
            "سجل المحادثات",
            "نماذج المستندات",
            "دعم أولوي",
          ],
          popular: true,
          tier: "basic",
        },
        {
          name: "احترافي",
          price: "300",
          currency: "ج.م",
          description: "للمستخدمين المتقدمين الذين يحتاجون المزيد",
          features: [
            "50 سؤالاً يومياً",
            "كل ما في الباقة الأساسية",
            "التواصل مع المحامين",
            "ردود ذكاء اصطناعي أولوية",
            "تصدير المحادثات كـ PDF",
          ],
          tier: "pro",
        },
        {
          name: "مميز",
          price: "600",
          currency: "ج.م",
          description: "لمن يحتاجون دعماً احترافياً",
          features: [
            "أسئلة غير محدودة",
            "كل ما في الباقة الاحترافية",
            "مراجعة المحامي للردود",
            "استشارة مباشرة مع محامٍ (1/شهر)",
            "دعم مميز على مدار الساعة",
          ],
          tier: "premium",
        },
      ],
    },
  };

  const t = content[language];

  const handleCTAClick = (plan: any) => {
    if (plan.tier) {
      // Paid plan - open payment modal
      setSelectedTier(plan.tier);
      setShowPaymentModal(true);
    }
    // Free plan - handled by Link component
  };

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
        <div className="grid gap-8 lg:grid-cols-4">
          {t.plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col border-2 ${plan.popular
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
                {plan.href ? (
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={plan.href}>{t.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${plan.popular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : ""
                      }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleCTAClick(plan)}
                  >
                    {t.ctaPaid}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Modal - TODO: Will be created next */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Payment Modal (Coming Soon)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selected tier: {selectedTier}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Paymob integration will be implemented here.
            </p>
            <Button
              onClick={() => setShowPaymentModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
