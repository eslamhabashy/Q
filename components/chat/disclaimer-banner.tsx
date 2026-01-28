"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerBannerProps {
  language: "en" | "ar";
}

export function DisclaimerBanner({ language }: DisclaimerBannerProps) {
  const isRTL = language === "ar";

  const content = {
    en: "This is legal information, not legal advice. Consult a licensed lawyer for your specific case.",
    ar: "هذه معلومات قانونية، وليست استشارة قانونية. استشر محامياً مرخصاً لحالتك المحددة.",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 text-center text-sm text-accent"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{content[language]}</span>
    </div>
  );
}
