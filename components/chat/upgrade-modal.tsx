"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Zap, Crown, Check } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import Image from "next/image";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (tier: "basic" | "pro" | "premium") => void;
    currentTier?: string;
    currentUsage?: number;
    dailyLimit?: number;
    reason?: "limit_reached" | "subscription_expired" | "feature_locked";
}

export function UpgradeModal({
    isOpen,
    onClose,
    onUpgrade,
    currentTier = "free",
    currentUsage = 0,
    dailyLimit = 3,
    reason = "limit_reached",
}: UpgradeModalProps) {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const isRTL = language === "ar";

    const content = {
        en: {
            title: {
                limit_reached: "Daily Limit Reached",
                subscription_expired: "Subscription Expired",
                feature_locked: "Premium Feature",
            },
            subtitle: {
                limit_reached: `You've used ${currentUsage} of ${dailyLimit} daily questions`,
                subscription_expired: "Your subscription has expired. Renew to continue.",
                feature_locked: "This feature requires a premium subscription",
            },
            upgradeNow: "Upgrade to continue asking questions and get more benefits",
            currentPlan: "Current Plan",
            recommendedPlan: "Recommended",
            close: "Maybe Later",
            tiers: {
                basic: {
                    name: "Basic",
                    price: "100 EGP/mo",
                    limit: "10 questions/day",
                    features: ["Full Egyptian law coverage", "Conversation history", "Document templates"],
                    icon: "trending",
                    gradient: "from-blue-500/10 to-blue-500/5",
                    border: "border-blue-200 dark:border-blue-800",
                },
                pro: {
                    name: "Pro",
                    price: "300 EGP/mo",
                    limit: "50 questions/day",
                    features: ["Everything in Basic", "Connect with lawyers", "Priority responses"],
                    icon: "zap",
                    gradient: "from-amber-500/10 to-amber-500/5",
                    border: "border-amber-200 dark:border-amber-800",
                },
                premium: {
                    name: "Premium",
                    price: "600 EGP/mo",
                    limit: "Unlimited questions",
                    features: ["Everything in Pro", "Lawyer review", "Direct consultation"],
                    icon: "crown",
                    gradient: "from-purple-500/10 to-purple-500/5",
                    border: "border-purple-200 dark:border-purple-800",
                },
            },
        },
        ar: {
            title: {
                limit_reached: "تم الوصول للحد اليومي",
                subscription_expired: "انتهت صلاحية الاشتراك",
                feature_locked: "ميزة مميزة",
            },
            subtitle: {
                limit_reached: `لقد استخدمت ${currentUsage} من ${dailyLimit} أسئلة يومية`,
                subscription_expired: "انتهت صلاحية اشتراكك. جدد للمتابعة.",
                feature_locked: "تتطلب هذه الميزة اشتراكاً مميزاً",
            },
            upgradeNow: "قم بالترقية لمواصلة طرح الأسئلة والحصول على المزيد من المزايا",
            currentPlan: "الخطة الحالية",
            recommendedPlan: "موصى به",
            close: "ربما لاحقاً",
            tiers: {
                basic: {
                    name: "أساسي",
                    price: "100 ج.م/شهر",
                    limit: "10 أسئلة/يوم",
                    features: ["تغطية كاملة للقانون المصري", "سجل المحادثات", "نماذج المستندات"],
                    icon: "trending",
                    gradient: "from-blue-500/10 to-blue-500/5",
                    border: "border-blue-200 dark:border-blue-800",
                },
                pro: {
                    name: "احترافي",
                    price: "300 ج.م/شهر",
                    limit: "50 سؤالاً/يوم",
                    features: ["كل ما في الأساسية", "التواصل مع المحامين", "ردود أولوية"],
                    icon: "zap",
                    gradient: "from-amber-500/10 to-amber-500/5",
                    border: "border-amber-200 dark:border-amber-800",
                },
                premium: {
                    name: "مميز",
                    price: "600 ج.م/شهر",
                    limit: "أسئلة غير محدودة",
                    features: ["كل ما في الاحترافية", "مراجعة المحامي", "استشارة مباشرة"],
                    icon: "crown",
                    gradient: "from-purple-500/10 to-purple-500/5",
                    border: "border-purple-200 dark:border-purple-800",
                },
            },
        },
    };

    const t = content[language];

    // Determine recommended tier based on current tier
    const getRecommendedTier = (): "basic" | "pro" | "premium" => {
        if (currentTier === "free") return "basic";
        if (currentTier === "basic") return "pro";
        return "premium";
    };

    const recommendedTier = getRecommendedTier();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "trending":
                return <TrendingUp className="h-5 w-5" />;
            case "zap":
                return <Zap className="h-5 w-5" />;
            case "crown":
                return <Crown className="h-5 w-5" />;
            default:
                return <TrendingUp className="h-5 w-5" />;
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
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border-0 shadow-2xl bg-card"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative header background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                <CardHeader className="relative pb-2 text-center pt-8">
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

                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        {t.title[reason]}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 max-w-lg mx-auto">
                        {t.subtitle[reason]}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 p-6 md:p-8 pt-4">
                    {/* Upgrade Message */}
                    <div className="text-center">
                        <p className="text-muted-foreground font-medium">{t.upgradeNow}</p>
                    </div>

                    {/* Tier Options */}
                    <div className="grid gap-4 md:grid-cols-3 items-stretch">
                        {(["basic", "pro", "premium"] as const).map((tierKey) => {
                            const tierData = t.tiers[tierKey];
                            const isRecommended = tierKey === recommendedTier;
                            const isCurrent = tierKey === currentTier;

                            return (
                                <div
                                    key={tierKey}
                                    className={`
                                        relative rounded-xl border-2 transition-all duration-300 flex flex-col
                                        ${isRecommended
                                            ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10 bg-card"
                                            : "border-border hover:border-border/80 hover:shadow-lg bg-card/50"
                                        }
                                        ${isCurrent ? "opacity-75 grayscale-[0.5]" : ""}
                                    `}
                                >
                                    {/* Recommended Badge */}
                                    {isRecommended && (
                                        <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                            <Badge className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-primary-foreground px-4 py-1 text-sm shadow-md">
                                                {t.recommendedPlan}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Current Plan Badge */}
                                    {isCurrent && (
                                        <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                            <Badge variant="secondary" className="text-xs">
                                                {t.currentPlan}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className={`p-6 pb-4 rounded-t-xl bg-gradient-to-b ${tierData.gradient}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-2.5 rounded-lg bg-background shadow-sm ring-1 ring-border/50`}>
                                                {getIcon(tierData.icon)}
                                            </div>
                                            <h3 className="font-bold text-xl">{tierData.name}</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold text-foreground">
                                                {tierData.price}
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {tierData.limit}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="p-6 pt-4 flex-1 flex flex-col">
                                        <div className="space-y-3 flex-1 mb-6">
                                            {tierData.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-sm group">
                                                    <div className={`mt-0.5 rounded-full p-0.5 ${isRecommended ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"}`}>
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => onUpgrade(tierKey)}
                                            className={`w-full transition-all duration-300 ${isRecommended
                                                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                                : "hover:bg-primary/5"
                                                }`}
                                            variant={isRecommended ? "default" : "outline"}
                                            disabled={isCurrent}
                                            size="lg"
                                        >
                                            {isCurrent
                                                ? t.currentPlan
                                                : isRecommended
                                                    ? t.tiers[tierKey].name
                                                    : language === "en"
                                                        ? "Select Plan"
                                                        : "اختر الخطة"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Close Link */}
                    <button
                        onClick={onClose}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t.close}
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
