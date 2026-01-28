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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { language } = useLanguage();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }

            toast.success(language === "ar" ? "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني" : "Account created successfully! Please check your email.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || (language === "ar" ? "حدث خطأ أثناء إنشاء الحساب" : "Error creating account"));
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        title: language === "ar" ? "إنشاء حساب" : "Sign Up",
        description: language === "ar" ? "أدخل بياناتك لإنشاء حساب جديد" : "Enter your details to create a new account",
        email: language === "ar" ? "البريد الإلكتروني" : "Email",
        password: language === "ar" ? "كلمة المرور" : "Password",
        signUp: language === "ar" ? "إنشاء حساب" : "Sign Up",
        hasAccount: language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?",
        login: language === "ar" ? "تسجيل الدخول" : "Log In",
        loading: language === "ar" ? "جاري التحميل..." : "Loading...",
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
        </div>
    );
}
