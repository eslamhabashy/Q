"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function PaymentCancel() {
    const router = useRouter();
    const { language } = useLanguage();
    const [countdown, setCountdown] = useState(10);

    const content = {
        en: {
            title: "Payment Canceled",
            subtitle: "Your payment was not completed",
            message: "No charges were made to your account.",
            reasons: "This could happen because:",
            reason1: "You clicked the back button",
            reason2: "Payment window was closed",
            reason3: "You chose to cancel the payment",
            whatToDo: "What you can do:",
            action1: "Try subscribing again if you changed your mind",
            action2: "Contact support if you encountered an issue",
            action3: "Continue using the free tier",
            tryAgain: "Try Again",
            backToChat: "Back to Chat",
            viewPlans: "View Plans",
            autoRedirect: "Redirecting to pricing in",
            seconds: "seconds",
            stillInterested: "Still interested in Qanunak?",
            contactSupport: "Contact Support",
        },
        ar: {
            title: "تم إلغاء الدفع",
            subtitle: "لم تكتمل عملية الدفع",
            message: "لم يتم فرض أية رسوم على حسابك.",
            reasons: "قد يحدث هذا بسبب:",
            reason1: "نقرت على زر الرجوع",
            reason2: "تم إغلاق نافذة الدفع",
            reason3: "اخترت إلغاء الدفع",
            whatToDo: "ما يمكنك فعله:",
            action1: "حاول الاشتراك مرة أخرى إذا غيرت رأيك",
            action2: "اتصل بالدعم إذا واجهت مشكلة",
            action3: "استمر في استخدام الباقة المجانية",
            tryAgain: "حاول مرة أخرى",
            backToChat: "العودة للدردشة",
            viewPlans: "عرض الخطط",
            autoRedirect: "إعادة التوجيه للأسعار خلال",
            seconds: "ثواني",
            stillInterested: "ما زلت مهتماً بقانونك؟",
            contactSupport: "اتصل بالدعم",
        },
    };

    const t = content[language];
    const isRTL = language === "ar";

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push("/pricing");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={isRTL ? "rtl" : "ltr"}>
            <div className="max-w-2xl w-full">
                {/* Cancel Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 border-2 border-orange-500/20">
                            <XCircle className="h-10 w-10 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
                    {t.title}
                </h1>
                <p className="text-center text-muted-foreground mb-8">
                    {t.subtitle}
                </p>

                {/* Info Card */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <p className="text-sm text-center text-green-600 dark:text-green-500 mb-6 font-medium">
                        {t.message}
                    </p>

                    <h2 className="font-semibold mb-4 text-foreground">
                        {t.reasons}
                    </h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                            <span className="text-orange-500 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason1}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-orange-500 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason2}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-orange-500 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason3}</span>
                        </li>
                    </ul>

                    <h2 className="font-semibold mb-4 text-foreground">
                        {t.whatToDo}
                    </h2>
                    <ol className={`space-y-3 ${isRTL ? "list-arabic" : "list-decimal"} list-inside`}>
                        <li className="text-sm text-muted-foreground">{t.action1}</li>
                        <li className="text-sm text-muted-foreground">{t.action2}</li>
                        <li className="text-sm text-muted-foreground">{t.action3}</li>
                    </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button
                        onClick={() => router.push("/pricing")}
                        className="flex-1"
                    >
                        {t.tryAgain}
                    </Button>
                    <Button
                        onClick={() => router.push("/chat")}
                        variant="outline"
                        className="flex-1"
                    >
                        {t.backToChat}
                    </Button>
                </div>

                {/* Auto-redirect Notice */}
                <div className="text-center text-sm text-muted-foreground mb-4">
                    {t.autoRedirect} <span className="font-semibold text-foreground">{countdown}</span> {t.seconds}
                </div>

                {/* Support Link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {t.stillInterested}{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            {t.contactSupport}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
