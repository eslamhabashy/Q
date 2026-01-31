import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionStatus {
    tier: "free" | "basic" | "pro" | "premium";
    status: "active" | "inactive" | "past_due" | "canceled";
    dailyQuestionCount: number;
    dailyLimit: number;
    subscriptionEndDate: Date | null;
    canAskQuestion: boolean;
    isExpired: boolean;
    isLoading: boolean;
}

const TIER_LIMITS = {
    free: 3,
    basic: 10,
    pro: 50,
    premium: Infinity,
};

export function useSubscription() {
    const [subscription, setSubscription] = useState<SubscriptionStatus>({
        tier: "free",
        status: "inactive",
        dailyQuestionCount: 0,
        dailyLimit: 3,
        subscriptionEndDate: null,
        canAskQuestion: true,
        isExpired: false,
        isLoading: true,
    });

    useEffect(() => {
        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Not logged in - return free tier
                setSubscription({
                    tier: "free",
                    status: "inactive",
                    dailyQuestionCount: 0,
                    dailyLimit: 3,
                    subscriptionEndDate: null,
                    canAskQuestion: true,
                    isExpired: false,
                    isLoading: false,
                });
                return;
            }

            // Fetch user profile with subscription info
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("subscription_tier, subscription_status, daily_question_count, subscription_end_date")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching subscription:", error);
                setSubscription((prev) => ({ ...prev, isLoading: false }));
                return;
            }

            const tier = (profile?.subscription_tier || "free") as "free" | "basic" | "pro" | "premium";
            const status = (profile?.subscription_status || "inactive") as "active" | "inactive" | "past_due" | "canceled";
            const dailyQuestionCount = profile?.daily_question_count || 0;
            const dailyLimit = TIER_LIMITS[tier];
            const subscriptionEndDate = profile?.subscription_end_date
                ? new Date(profile.subscription_end_date)
                : null;

            // Check if subscription is expired
            const isExpired =
                subscriptionEndDate !== null && subscriptionEndDate < new Date();

            // Check if user can ask a question
            const canAskQuestion =
                !isExpired &&
                (status === "active" || tier === "free") &&
                dailyQuestionCount < dailyLimit;

            setSubscription({
                tier,
                status,
                dailyQuestionCount,
                dailyLimit,
                subscriptionEndDate,
                canAskQuestion,
                isExpired,
                isLoading: false,
            });
        } catch (error) {
            console.error("Subscription check error:", error);
            setSubscription((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const incrementQuestionCount = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Increment the daily question count
            const { error } = await supabase.rpc("increment_daily_questions", {
                user_id: user.id,
            });

            if (error) {
                console.error("Error incrementing question count:", error);
                return;
            }

            // Refresh subscription status
            await checkSubscription();
        } catch (error) {
            console.error("Error incrementing question count:", error);
        }
    };

    const refreshSubscription = () => {
        checkSubscription();
    };

    return {
        ...subscription,
        incrementQuestionCount,
        refreshSubscription,
    };
}
