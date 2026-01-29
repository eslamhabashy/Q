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

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { language } = useLanguage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Check for redirect parameter
            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get('redirect') || '/dashboard';

            router.push(redirect);
            router.refresh();
            toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح" : "Logged in successfully");
        } catch (error: any) {
            toast.error(error.message || (language === "ar" ? "حدث خطأ أثناء تسجيل الدخول" : "Error logging in"));
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        title: language === "ar" ? "تسجيل الدخول" : "Log In",
        description: language === "ar" ? "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك" : "Enter your email and password to access your account",
        email: language === "ar" ? "البريد الإلكتروني" : "Email",
        password: language === "ar" ? "كلمة المرور" : "Password",
        login: language === "ar" ? "تسجيل الدخول" : "Log In",
        noAccount: language === "ar" ? "لا تمتلك حساباً؟" : "Don't have an account?",
        signUp: language === "ar" ? "إنشاء حساب" : "Sign Up",
        loading: language === "ar" ? "جاري التحميل..." : "Loading...",
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t.login}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            {t.noAccount}{" "}
                            <Link href="/signup" className="text-primary hover:underline">
                                {t.signUp}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
