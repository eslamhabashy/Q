"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  language: "en" | "ar";
}

export function TestimonialsSection({ language }: TestimonialsSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      label: "Testimonials",
      title: "Trusted by thousands of Egyptians",
      testimonials: [
        {
          name: "Ahmed Hassan",
          role: "Small Business Owner",
          location: "Cairo",
          content:
            "Haqqi helped me understand my rights when dealing with a commercial lease dispute. The AI explained everything clearly and even provided template letters I could use.",
          rating: 5,
        },
        {
          name: "Fatima El-Sayed",
          role: "Teacher",
          location: "Alexandria",
          content:
            "I was worried about my employment contract renewal. Haqqi broke down the labor law sections relevant to my case and gave me confidence to negotiate better terms.",
          rating: 5,
        },
        {
          name: "Mohamed Ibrahim",
          role: "Freelancer",
          location: "Giza",
          content:
            "The document templates saved me thousands of pounds. I used their partnership agreement template when starting a business with my friend.",
          rating: 5,
        },
        {
          name: "Nour Abdel-Rahman",
          role: "University Student",
          location: "Mansoura",
          content:
            "As a student, I couldn't afford expensive legal consultations. Haqqi helped me understand my tenant rights when my landlord tried to illegally evict me.",
          rating: 5,
        },
      ],
    },
    ar: {
      label: "آراء العملاء",
      title: "موثوق به من قبل آلاف المصريين",
      testimonials: [
        {
          name: "أحمد حسن",
          role: "صاحب مشروع صغير",
          location: "القاهرة",
          content:
            "ساعدني حقي في فهم حقوقي عند التعامل مع نزاع إيجار تجاري. شرح الذكاء الاصطناعي كل شيء بوضوح وقدم لي حتى نماذج رسائل يمكنني استخدامها.",
          rating: 5,
        },
        {
          name: "فاطمة السيد",
          role: "معلمة",
          location: "الإسكندرية",
          content:
            "كنت قلقة بشأن تجديد عقد عملي. قام حقي بتفصيل أقسام قانون العمل المتعلقة بحالتي وأعطاني الثقة للتفاوض على شروط أفضل.",
          rating: 5,
        },
        {
          name: "محمد إبراهيم",
          role: "عامل حر",
          location: "الجيزة",
          content:
            "وفرت لي نماذج المستندات آلاف الجنيهات. استخدمت نموذج اتفاقية الشراكة عند بدء عمل تجاري مع صديقي.",
          rating: 5,
        },
        {
          name: "نور عبد الرحمن",
          role: "طالبة جامعية",
          location: "المنصورة",
          content:
            "كطالبة، لم أستطع تحمل تكلفة الاستشارات القانونية باهظة الثمن. ساعدني حقي في فهم حقوقي كمستأجرة عندما حاول مالك العقار طردي بشكل غير قانوني.",
          rating: 5,
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

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {t.testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {`"${testimonial.content}"`}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
