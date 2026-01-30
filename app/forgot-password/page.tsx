"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const supabase = createClient();
    const { language } = useLanguage();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
            toast.success(
                language === "ar"
                    ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
                    : "Password reset link sent to your email"
            );
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        title: language === "ar" ? "نسيت كلمة المرور" : "Forgot Password",
        description: language === "ar"
            ? "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
            : "Enter your email and we'll send you a password reset link",
        email: language === "ar" ? "البريد الإلكتروني" : "Email",
        sendLink: language === "ar" ? "إرسال الرابط" : "Send Link",
        backToLogin: language === "ar" ? "العودة لتسجيل الدخول" : "Back to Login",
        emailSentTitle: language === "ar" ? "تم إرسال البريد الإلكتروني" : "Email Sent",
        checkEmail: language === "ar"
            ? "تحقق من بريدك الإلكتروني (وصندوق الرسائل غير المرغوب فيها) للحصول على رابط إعادة تعيين كلمة المرور"
            : "Check your email (and spam folder) for the password reset link",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4" dir={language === "ar" ? "rtl" : "ltr"}>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleResetPassword}>
                    <CardContent className="space-y-4">
                        {emailSent ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                                <div>
                                    <h3 className="font-semibold mb-2">{t.emailSentTitle}</h3>
                                    <p className="text-sm text-muted-foreground">{t.checkEmail}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        {!emailSent && (
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t.sendLink}
                            </Button>
                        )}
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full">
                                {t.backToLogin}
                            </Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
