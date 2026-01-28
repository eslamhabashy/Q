"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

interface FooterProps {
  language: "en" | "ar";
}

export function Footer({ language }: FooterProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      description:
        "AI-powered legal information for everyday Egyptians. Understand your rights and navigate common legal matters with confidence.",
      disclaimer:
        "Haqqi provides legal information for educational purposes only. This is not legal advice and does not create an attorney-client relationship. Always consult a licensed attorney for your specific legal needs.",
      product: "Product",
      productLinks: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Templates", href: "/templates" },
        { label: "Find a Lawyer", href: "/lawyers" },
      ],
      company: "Company",
      companyLinks: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
      legal: "Legal",
      legalLinks: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
      copyright: "© 2025 Haqqi. All rights reserved.",
      madeWith: "Made with care in Egypt",
    },
    ar: {
      description:
        "معلومات قانونية مدعومة بالذكاء الاصطناعي للمصريين العاديين. افهم حقوقك وتعامل مع المسائل القانونية الشائعة بثقة.",
      disclaimer:
        "يقدم حقي معلومات قانونية لأغراض تعليمية فقط. هذه ليست استشارة قانونية ولا تنشئ علاقة محامي-موكل. استشر دائماً محامياً مرخصاً لاحتياجاتك القانونية المحددة.",
      product: "المنتج",
      productLinks: [
        { label: "المميزات", href: "#features" },
        { label: "الأسعار", href: "#pricing" },
        { label: "النماذج", href: "/templates" },
        { label: "ابحث عن محامي", href: "/lawyers" },
      ],
      company: "الشركة",
      companyLinks: [
        { label: "من نحن", href: "/about" },
        { label: "اتصل بنا", href: "/contact" },
        { label: "الوظائف", href: "/careers" },
        { label: "المدونة", href: "/blog" },
      ],
      legal: "قانوني",
      legalLinks: [
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "شروط الخدمة", href: "/terms" },
        { label: "إخلاء المسؤولية", href: "/disclaimer" },
      ],
      copyright: "© 2025 حقي. جميع الحقوق محفوظة.",
      madeWith: "صنع بعناية في مصر",
    },
  };

  const t = content[language];

  return (
    <footer
      className="border-t border-border bg-primary"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Scale className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">
                {language === "ar" ? "حقّي" : "Haqqi"}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              {t.description}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold text-primary-foreground">
              {t.product}
            </h3>
            <ul className="space-y-3">
              {t.productLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold text-primary-foreground">
              {t.company}
            </h3>
            <ul className="space-y-3">
              {t.companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold text-primary-foreground">
              {t.legal}
            </h3>
            <ul className="space-y-3">
              {t.legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <p className="text-xs leading-relaxed text-primary-foreground/50">
            {t.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <p className="text-sm text-primary-foreground/60">{t.copyright}</p>
          <p className="text-sm text-primary-foreground/60">{t.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
