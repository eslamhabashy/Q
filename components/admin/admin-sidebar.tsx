"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Scale,
    LayoutDashboard,
    FileText,
    Users,
    Star,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
    language?: "en" | "ar";
}

export function AdminSidebar({ language = "en" }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const isRTL = language === "ar";

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        {
            href: "/admin",
            label: language === "ar" ? "لوحة التحكم" : "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/admin/templates",
            label: language === "ar" ? "نماذج المستندات" : "Templates",
            icon: FileText,
        },
        {
            href: "/admin/lawyers",
            label: language === "ar" ? "المحامون" : "Lawyers",
            icon: Users,
        },
        {
            href: "/admin/reviews",
            label: language === "ar" ? "التقييمات" : "Reviews",
            icon: Star,
        },
        {
            href: "/admin/faqs",
            label: language === "ar" ? "الأسئلة الشائعة" : "FAQs",
            icon: HelpCircle,
        },
    ];

    return (
        <aside
            className={cn(
                "flex w-64 flex-col border-r border-sidebar-border bg-sidebar",
                isRTL && "border-l border-r-0"
            )}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Header */}
            <div className="flex h-14 items-center border-b border-sidebar-border px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                        <Scale className="h-4 w-4 text-sidebar-primary-foreground" />
                    </div>
                    <div>
                        <span className="font-semibold text-sidebar-foreground">
                            {language === "ar" ? "قانونك" : "Qanunak"}
                        </span>
                        <p className="text-xs text-sidebar-foreground/60">
                            {language === "ar" ? "لوحة الإدارة" : "Admin Panel"}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Button
                                key={item.href}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    isActive && "bg-sidebar-accent"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <Icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    {item.label}
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-sidebar-border p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground"
                    onClick={handleSignOut}
                >
                    <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                </Button>
            </div>
        </aside>
    );
}
