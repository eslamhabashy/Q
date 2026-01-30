"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { FileText, Users, Star, HelpCircle, TrendingUp } from "lucide-react";

interface Stats {
    templates: number;
    lawyers: number;
    reviews: number;
    faqs: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        templates: 0,
        lawyers: 0,
        reviews: 0,
        faqs: 0,
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [templatesRes, lawyersRes, reviewsRes, faqsRes] = await Promise.all([
                    supabase.from("document_templates").select("id", { count: "exact", head: true }),
                    supabase.from("lawyers").select("id", { count: "exact", head: true }),
                    supabase.from("reviews").select("id", { count: "exact", head: true }),
                    supabase.from("faqs").select("id", { count: "exact", head: true }),
                ]);

                setStats({
                    templates: templatesRes.count || 0,
                    lawyers: lawyersRes.count || 0,
                    reviews: reviewsRes.count || 0,
                    faqs: faqsRes.count || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [supabase]);

    const statCards = [
        {
            title: "Document Templates",
            value: stats.templates,
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-950",
        },
        {
            title: "Lawyers",
            value: stats.lawyers,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-950",
        },
        {
            title: "Reviews",
            value: stats.reviews,
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100 dark:bg-yellow-950",
        },
        {
            title: "FAQs",
            value: stats.faqs,
            icon: HelpCircle,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-950",
        },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your website content and monitor statistics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Total items
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <a
                            href="/admin/templates"
                            className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                            <FileText className="h-8 w-8 mb-2 text-primary" />
                            <span className="font-medium">Manage Templates</span>
                        </a>
                        <a
                            href="/admin/lawyers"
                            className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                            <Users className="h-8 w-8 mb-2 text-primary" />
                            <span className="font-medium">Manage Lawyers</span>
                        </a>
                        <a
                            href="/admin/reviews"
                            className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                            <Star className="h-8 w-8 mb-2 text-primary" />
                            <span className="font-medium">Manage Reviews</span>
                        </a>
                        <a
                            href="/admin/faqs"
                            className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                            <HelpCircle className="h-8 w-8 mb-2 text-primary" />
                            <span className="font-medium">Manage FAQs</span>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
