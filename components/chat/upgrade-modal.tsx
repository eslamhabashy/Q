"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Zap, Crown } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

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
            recommendedPlan: "Recommended for You",
            close: "Maybe Later",
            tiers: {
                basic: {
                    name: "Basic",
                    price: "100 EGP/month",
                    limit: "10 questions/day",
                    features: ["Full Egyptian law coverage", "Conversation history", "Document templates"],
                    icon: "trending",
                },
                pro: {
                    name: "Pro",
                    price: "300 EGP/month",
                    limit: "50 questions/day",
                    features: ["Everything in Basic", "Connect with lawyers", "Priority responses"],
                    icon: "zap",
                },
                premium: {
                    name: "Premium",
                    price: "600 EGP/month",
                    limit: "Unlimited questions",
                    features: ["Everything in Pro", "Lawyer review", "Direct consultation"],
                    icon: "crown",
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
            recommendedPlan: "موصى به لك",
            close: "ربما لاحقاً",
            tiers: {
                basic: {
                    name: "أساسي",
                    price: "100 ج.م/شهر",
                    limit: "10 أسئلة/يوم",
                    features: ["تغطية كاملة للقانون المصري", "سجل المحادثات", "نماذج المستندات"],
                    icon: "trending",
                },
                pro: {
                    name: "احترافي",
                    price: "300 ج.م/شهر",
                    limit: "50 سؤالاً/يوم",
                    features: ["كل ما في الأساسية", "التواصل مع المحامين", "ردود أولوية"],
                    icon: "zap",
                },
                premium: {
                    name: "مميز",
                    price: "600 ج.م/شهر",
                    limit: "أسئلة غير محدودة",
                    features: ["كل ما في الاحترافية", "مراجعة المحامي", "استشارة مباشرة"],
                    icon: "crown",
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
                return <TrendingUp className="h-6 w-6" />;
            case "zap":
                return <Zap className="h-6 w-6" />;
            case "crown":
                return <Crown className="h-6 w-6" />;
            default:
                return <TrendingUp className="h-6 w-6" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <Card
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full p-1 hover:bg-muted"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <CardTitle className="text-2xl">{t.title[reason]}</CardTitle>
                    <CardDescription className="text-base">{t.subtitle[reason]}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Current Plan Badge */}
                    {currentTier !== "free" && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{t.currentPlan}</Badge>
                            <span className="text-sm text-muted-foreground capitalize">
                                {currentTier}
                            </span>
                        </div>
                    )}

                    {/* Upgrade Message */}
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <p className="text-sm text-foreground">{t.upgradeNow}</p>
                    </div>

                    {/* Tier Options */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {(["basic", "pro", "premium"] as const).map((tierKey) => {
                            const tierData = t.tiers[tierKey];
                            const isRecommended = tierKey === recommendedTier;
                            const isCurrent = tierKey === currentTier;

                            return (
                                <Card
                                    key={tierKey}
                                    className={`relative ${isRecommended
                                            ? "border-2 border-accent shadow-lg shadow-accent/20"
                                            : isCurrent
                                                ? "border-2 border-muted opacity-60"
                                                : "border-2 border-border"
                                        }`}
                                >
                                    {isRecommended && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                                            {t.recommendedPlan}
                                        </Badge>
                                    )}
                                    {isCurrent && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground">
                                            {t.currentPlan}
                                        </Badge>
                                    )}

                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-lg ${isRecommended ? "bg-accent text-accent-foreground" : "bg-muted"}`}>
                                                {getIcon(tierData.icon)}
                                            </div>
                                            <CardTitle className="text-lg">{tierData.name}</CardTitle>
                                        </div>
                                        <div className="text-sm font-semibold text-accent">
                                            {tierData.price}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {tierData.limit}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <ul className="space-y-2 text-xs">
                                            {tierData.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-accent mt-0.5">✓</span>
                                                    <span className="text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => onUpgrade(tierKey)}
                                            className="w-full"
                                            variant={isRecommended ? "default" : "outline"}
                                            disabled={isCurrent}
                                        >
                                            {isCurrent
                                                ? t.currentPlan
                                                : isRecommended
                                                    ? t.tiers[tierKey].name
                                                    : language === "en"
                                                        ? "Select"
                                                        : "اختر"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="w-full"
                    >
                        {t.close}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
