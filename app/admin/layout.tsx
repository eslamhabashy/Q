"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAdmin = async () => {
            if (!isLoading && !user) {
                router.push("/login?redirect=/admin");
                return;
            }

            if (user) {
                // Check if user has admin role
                const { data, error } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", user.id)
                    .single();

                if (error || !data?.is_admin) {
                    toast.error("Access denied. Admin privileges required.");
                    router.push("/dashboard");
                }
            }
        };

        checkAdmin();
    }, [user, isLoading, router, supabase]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
