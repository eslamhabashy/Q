"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function AuthCodeError() {
    const router = useRouter();
    const { language } = useLanguage();
    const [countdown, setCountdown] = useState(10);

    const content = {
        en: {
            title: "Email Verification Issue",
            subtitle: "We had trouble verifying your email",
            reasons: "This could happen because:",
            reason1: "The verification link has expired (links are valid for 24 hours)",
            reason2: "The link has already been used",
            reason3: "The link was copied incorrectly",
            whatToDo: "What you can do:",
            action1: "Request a new verification email from the signup page",
            action2: "Make sure to verify your email within 24 hours",
            action3: "Copy the entire link from your email",
            backToSignup: "Back to Sign Up",
            backToLogin: "Try Logging In",
            autoRedirect: "Auto-redirecting to signup in",
            seconds: "seconds",
            needHelp: "Need help?",
            contactSupport: "Contact Support",
        },
        ar: {
            title: "مشكلة في التحقق من البريد الإلكتروني",
            subtitle: "واجهنا مشكلة في التحقق من بريدك الإلكتروني",
            reasons: "قد يحدث هذا بسبب:",
            reason1: "انتهت صلاحية رابط التحقق (الروابط صالحة لمدة 24 ساعة)",
            reason2: "تم استخدام الرابط بالفعل",
            reason3: "لم يتم نسخ الرابط بشكل صحيح",
            whatToDo: "ما يمكنك فعله:",
            action1: "اطلب بريدًا إلكترونيًا جديدًا للتحقق من صفحة التسجيل",
            action2: "تأكد من التحقق من بريدك الإلكتروني خلال 24 ساعة",
            action3: "انسخ الرابط بالكامل من بريدك الإلكتروني",
            backToSignup: "العودة للتسجيل",
            backToLogin: "جرب تسجيل الدخول",
            autoRedirect: "إعادة التوجيه التلقائي للتسجيل خلال",
            seconds: "ثواني",
            needHelp: "تحتاج مساعدة؟",
            contactSupport: "اتصل بالدعم",
        },
    };

    const t = content[language];
    const isRTL = language === "ar";

    // Auto-redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push("/signup");
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
                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/20">
                            <AlertCircle className="h-10 w-10 text-destructive" />
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

                {/* Reasons Card */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <h2 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        {t.reasons}
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-destructive mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason1}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason2}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{t.reason3}</span>
                        </li>
                    </ul>
                </div>

                {/* What to Do Card */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
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
                        onClick={() => router.push("/signup")}
                        className="flex-1"
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        {t.backToSignup}
                    </Button>
                    <Button
                        onClick={() => router.push("/login")}
                        variant="outline"
                        className="flex-1"
                    >
                        {t.backToLogin}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Auto-redirect Notice */}
                <div className="text-center text-sm text-muted-foreground mb-4">
                    {t.autoRedirect} <span className="font-semibold text-foreground">{countdown}</span> {t.seconds}
                </div>

                {/* Support Link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {t.needHelp}{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            {t.contactSupport}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
