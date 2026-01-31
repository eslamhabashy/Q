"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const [countdown, setCountdown] = useState(5);
    const [loading, setLoading] = useState(true);

    const content = {
        en: {
            title: "Payment Successful!",
            subtitle: "Your subscription has been activated",
            thankYou: "Thank you for subscribing to Qanunak!",
            benefits: "You now have access to:",
            benefit1: "Extended question limits",
            benefit2: "Conversation history",
            benefit3: "Document templates",
            benefit4: "Priority support",
            redirecting: "Redirecting to chat in",
            seconds: "seconds",
            goToChat: "Go to Chat Now",
            viewSubscription: "View Subscription Details",
        },
        ar: {
            title: "تم الدفع بنجاح!",
            subtitle: "تم تفعيل اشتراكك",
            thankYou: "شكراً لاشتراكك في قانونك!",
            benefits: "لديك الآن إمكانية الوصول إلى:",
            benefit1: "حدود أسئلة ممتدة",
            benefit2: "سجل المحادثات",
            benefit3: "قوالب المستندات",
            benefit4: "دعم ذو أولوية",
            redirecting: "إعادة التوجيه إلى الدردشة خلال",
            seconds: "ثواني",
            goToChat: "انتقل إلى الدردشة الآن",
            viewSubscription: "عرض تفاصيل الاشتراك",
        },
    };

    const t = content[language];
    const isRTL = language === "ar";

    useEffect(() => {
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                setLoading(false);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2,
                },
            });
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2,
                },
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (loading) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push("/chat");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={isRTL ? "rtl" : "ltr"}>
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/20">
                            {loading ? (
                                <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                            ) : (
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            )}
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

                {/* Thank You Card */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <p className="text-lg font-semibold mb-4 text-center text-foreground">
                        {t.thankYou}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{t.benefits}</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{t.benefit1}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{t.benefit2}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{t.benefit3}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{t.benefit4}</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                {!loading && (
                    <>
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <Button
                                onClick={() => router.push("/chat")}
                                className="flex-1 bg-green-500 hover:bg-green-600"
                            >
                                {t.goToChat}
                            </Button>
                            <Button
                                onClick={() => router.push("/dashboard")}
                                variant="outline"
                                className="flex-1"
                            >
                                {t.viewSubscription}
                            </Button>
                        </div>

                        {/* Auto-redirect Notice */}
                        <div className="text-center text-sm text-muted-foreground">
                            {t.redirecting} <span className="font-semibold text-foreground">{countdown}</span> {t.seconds}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
