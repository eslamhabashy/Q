"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedTier?: "basic" | "pro" | "premium";
    preselectedCycle?: "monthly" | "yearly";
}

export function PaymentModal({
    isOpen,
    onClose,
    preselectedTier = "basic",
    preselectedCycle = "monthly",
}: PaymentModalProps) {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const [tier, setTier] = useState(preselectedTier);
    const [billingCycle, setBillingCycle] = useState(preselectedCycle);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const isRTL = language === "ar";

    const content = {
        en: {
            title: "Subscribe to Qanunak",
            subtitle: "Choose your plan and start asking legal questions",
            selectTier: "Select Plan",
            selectCycle: "Billing Cycle",
            monthly: "Monthly",
            yearly: "Yearly (20% off)",
            paymentMethod: "Payment Method",
            card: "Credit/Debit Card",
            wallet: "Mobile Wallet",
            installments: "Installments",
            total: "Total",
            perMonth: "per month",
            perYear: "per year",
            proceedToPayment: "Proceed to Payment",
            processing: "Processing...",
            cancel: "Cancel",
            discount: "20% discount",
            tiers: {
                basic: {
                    name: "Basic",
                    price: { monthly: 100, yearly: 960 },
                    features: ["10 questions/day", "Conversation history", "Document templates"],
                },
                pro: {
                    name: "Pro",
                    price: { monthly: 300, yearly: 2880 },
                    features: ["50 questions/day", "Everything in Basic", "Connect with lawyers"],
                },
                premium: {
                    name: "Premium",
                    price: { monthly: 600, yearly: 5760 },
                    features: ["Unlimited questions", "Everything in Pro", "Lawyer review"],
                },
            },
        },
        ar: {
            title: "اشترك في قانونك",
            subtitle: "اختر خطتك وابدأ في طرح الأسئلة القانونية",
            selectTier: "اختر الخطة",
            selectCycle: "دورة الفوترة",
            monthly: "شهرياً",
            yearly: "سنوياً (خصم 20%)",
            paymentMethod: "طريقة الدفع",
            card: "بطاقة ائتمان/خصم",
            wallet: "محفظة الموبايل",
            installments: "التقسيط",
            total: "المجموع",
            perMonth: "شهرياً",
            perYear: "سنوياً",
            proceedToPayment: "المتابعة للدفع",
            processing: "جارٍ المعالجة...",
            cancel: "إلغاء",
            discount: "خصم 20%",
            tiers: {
                basic: {
                    name: "أساسي",
                    price: { monthly: 100, yearly: 960 },
                    features: ["10 أسئلة/يوم", "سجل المحادثات", "نماذج المستندات"],
                },
                pro: {
                    name: "احترافي",
                    price: { monthly: 300, yearly: 2880 },
                    features: ["50 سؤالاً/يوم", "كل ما في الأساسية", "التواصل مع المحامين"],
                },
                premium: {
                    name: "مميز",
                    price: { monthly: 600, yearly: 5760 },
                    features: ["أسئلة غير محدودة", "كل ما في الاحترافية", "مراجعة المحامي"],
                },
            },
        },
    };

    const t = content[language];
    const selectedTierData = t.tiers[tier];
    const price = selectedTierData.price[billingCycle];

    const handlePayment = async () => {
        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error(language === "en" ? "Please login first" : "الرجاء تسجيل الدخول أولاً");
                window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
                return;
            }

            // Call create-order API
            const response = await fetch("/api/paymob/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tier,
                    billingCycle,
                    paymentMethod,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create payment order");
            }

            const data = await response.json();

            if (data.success && data.iframeUrl) {
                // Open Paymob iframe URL in same window
                window.location.href = data.iframeUrl;
            } else {
                throw new Error("Invalid payment response");
            }
        } catch (error: any) {
            console.error("Payment error:", error);
            toast.error(
                language === "en"
                    ? error.message || "Payment failed. Please try again."
                    : error.message || "فشل الدفع. يرجى المحاولة مرة أخرى."
            );
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <Card
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-0 shadow-2xl bg-card"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative header background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <CardHeader className="relative text-center pb-2 pt-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full p-2 hover:bg-muted/80 transition-colors z-10"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Logo Section */}
                    <div className="mx-auto mb-6 relative h-36 w-96 max-w-full">
                        <img
                            src={theme === "dark" ? "/logos/logo-dark.png" : (language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png")}
                            alt="Qanunak"
                            className="object-contain h-full w-full"
                        />
                    </div>

                    <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
                    <CardDescription className="text-base">{t.subtitle}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Tier Selection */}
                    <div>
                        <label className="text-sm font-medium mb-3 block text-foreground/80">{t.selectTier}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["basic", "pro", "premium"] as const).map((tierKey) => (
                                <button
                                    key={tierKey}
                                    onClick={() => setTier(tierKey)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${tier === tierKey
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className={`text-sm font-bold mb-1 ${tier === tierKey ? "text-primary" : "text-foreground"}`}>
                                        {t.tiers[tierKey].name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t.tiers[tierKey].price.monthly} EGP
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Billing Cycle */}
                    <div>
                        <label className="text-sm font-medium mb-3 block text-foreground/80">{t.selectCycle}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${billingCycle === "monthly"
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="text-sm font-semibold">{t.monthly}</div>
                                <div className="text-xs text-muted-foreground">
                                    {selectedTierData.price.monthly} EGP
                                </div>
                            </button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`p-4 rounded-xl border-2 transition-all relative duration-200 ${billingCycle === "yearly"
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600 text-xs shadow-sm">
                                    {t.discount}
                                </Badge>
                                <div className="text-sm font-semibold">{t.yearly}</div>
                                <div className="text-xs text-muted-foreground">
                                    {selectedTierData.price.yearly} EGP
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="text-sm font-medium mb-3 block text-foreground/80">{t.paymentMethod}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod("card")}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 duration-200 ${paymentMethod === "card"
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <CreditCard className={`h-6 w-6 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-xs font-medium">{t.card}</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod("wallet")}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 duration-200 ${paymentMethod === "wallet"
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <Smartphone className={`h-6 w-6 ${paymentMethod === "wallet" ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-xs font-medium">{t.wallet}</span>
                            </button>

                        </div>
                    </div>

                    {/* Features Summary */}
                    <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                        <h4 className="font-bold mb-2 text-sm">{selectedTierData.name}</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {selectedTierData.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/10 rounded-xl">
                        <span className="font-bold text-lg">{t.total}:</span>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">{price} EGP</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                {billingCycle === "monthly" ? t.perMonth : t.perYear}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 text-base"
                            disabled={loading}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            onClick={handlePayment}
                            className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t.processing}
                                </>
                            ) : (
                                t.proceedToPayment
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
