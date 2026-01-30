"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { language } = useLanguage();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate terms acceptance
        if (!acceptedTerms) {
            toast.error(language === "ar" ? "يجب الموافقة على شروط الخدمة" : "You must accept the Terms of Service");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    },
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }

            // Show email verification prompt
            setShowVerificationPrompt(true);
            toast.success(language === "ar" ? "تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني" : "Account created! Please check your email.");
        } catch (error: any) {
            toast.error(error.message || (language === "ar" ? "حدث خطأ أثناء إنشاء الحساب" : "Error creating account"));
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        title: language === "ar" ? "إنشاء حساب" : "Sign Up",
        description: language === "ar" ? "أدخل بياناتك لإنشاء حساب جديد" : "Enter your details to create a new account",
        fullName: language === "ar" ? "الاسم الكامل" : "Full Name",
        fullNamePlaceholder: language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name",
        email: language === "ar" ? "البريد الإلكتروني" : "Email",
        phone: language === "ar" ? "رقم الهاتف" : "Phone Number",
        phonePlaceholder: language === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number",
        password: language === "ar" ? "كلمة المرور" : "Password",
        acceptTerms: language === "ar" ? "أوافق على" : "I agree to the",
        termsOfService: language === "ar" ? "شروط الخدمة" : "Terms of Service",
        privacyPolicy: language === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
        and: language === "ar" ? "و" : "and",
        signUp: language === "ar" ? "إنشاء حساب" : "Sign Up",
        hasAccount: language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?",
        login: language === "ar" ? "تسجيل الدخول" : "Log In",
        loading: language === "ar" ? "جاري التحميل..." : "Loading...",
        verifyEmail: language === "ar" ? "تحقق من بريدك الإلكتروني" : "Verify Your Email",
        verifyEmailMessage: language === "ar"
            ? "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى النقر على الرابط لتفعيل حسابك."
            : "A verification link has been sent to your email. Please click the link to activate your account.",
        checkSpam: language === "ar"
            ? "⚠️ لم تجد البريد الإلكتروني؟ تحقق من صندوق الرسائل غير المرغوب فيها (Spam)"
            : "⚠️ Can't find the email? Check your spam/junk folder",
        close: language === "ar" ? "إغلاق" : "Close",
        goToLogin: language === "ar" ? "الذهاب لتسجيل الدخول" : "Go to Login",
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">{t.fullName}</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder={t.fullNamePlaceholder}
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t.phone}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t.phonePlaceholder}
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="[0-9]{10,15}"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Terms of Service Acceptance */}
                        <div className="flex items-start space-x-2 space-x-reverse">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="terms" className="text-sm text-muted-foreground">
                                {t.acceptTerms}{" "}
                                <Link href="/terms" target="_blank" className="text-primary hover:underline">
                                    {t.termsOfService}
                                </Link>
                                {" "}{t.and}{" "}
                                <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                                    {t.privacyPolicy}
                                </Link>
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={isLoading || !acceptedTerms}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t.signUp}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            {t.hasAccount}{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                {t.login}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            {/* Email Verification Prompt Modal */}
            {showVerificationPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle>{t.verifyEmail}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">{t.verifyEmailMessage}</p>
                            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm font-medium">{t.checkSpam}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowVerificationPrompt(false)}
                                className="flex-1"
                            >
                                {t.close}
                            </Button>
                            <Button
                                onClick={() => router.push('/login')}
                                className="flex-1"
                            >
                                {t.goToLogin}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
