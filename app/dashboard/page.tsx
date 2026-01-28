"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Scale,
  MessageSquare,
  FileText,
  Download,
  Users,
  Plus,
  Clock,
  Crown,
  ArrowRight,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
}

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = language === "ar";

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Rental Agreement Dispute",
      preview: "What are my rights as a tenant if my landlord wants to...",
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 8,
    },
    {
      id: "2",
      title: "Employment Contract Review",
      preview: "Is it legal for my employer to change my working hours...",
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 12,
    },
    {
      id: "3",
      title: "Traffic Violation Appeal",
      preview: "I received a traffic ticket but I believe it was...",
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 5,
    },
    {
      id: "4",
      title: "Starting a Small Business",
      preview: "What are the legal requirements to register a...",
      timestamp: new Date(Date.now() - 259200000),
      messageCount: 15,
    },
  ]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const content = {
    en: {
      title: "Dashboard",
      welcome: "Welcome back, Ahmed",
      subtitle: "Here's an overview of your legal assistance activity",
      questionsAsked: "Questions Asked",
      savedConversations: "Saved Conversations",
      documentsDownloaded: "Documents Downloaded",
      thisMonth: "This month",
      recentConversations: "Recent Conversations",
      viewAll: "View All",
      quickActions: "Quick Actions",
      newQuestion: "New Question",
      browseTemplates: "Browse Templates",
      findLawyer: "Find a Lawyer",
      subscription: "Subscription",
      freePlan: "Free Plan",
      questionsRemaining: "questions remaining this month",
      upgradeNow: "Upgrade Now",
      unlimitedAccess: "Get unlimited questions and more features",
      home: "Home",
      dashboard: "Dashboard",
      settings: "Settings",
      logout: "Log Out",
    },
    ar: {
      title: "لوحة التحكم",
      welcome: "مرحباً بعودتك، أحمد",
      subtitle: "إليك نظرة عامة على نشاط المساعدة القانونية الخاص بك",
      questionsAsked: "الأسئلة المطروحة",
      savedConversations: "المحادثات المحفوظة",
      documentsDownloaded: "المستندات المحملة",
      thisMonth: "هذا الشهر",
      recentConversations: "المحادثات الأخيرة",
      viewAll: "عرض الكل",
      quickActions: "إجراءات سريعة",
      newQuestion: "سؤال جديد",
      browseTemplates: "تصفح النماذج",
      findLawyer: "ابحث عن محامي",
      subscription: "الاشتراك",
      freePlan: "الخطة المجانية",
      questionsRemaining: "أسئلة متبقية هذا الشهر",
      upgradeNow: "الترقية الآن",
      unlimitedAccess: "احصل على أسئلة غير محدودة والمزيد من الميزات",
      home: "الرئيسية",
      dashboard: "لوحة التحكم",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
    },
  };

  const t = content[language];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return language === "ar" ? "الآن" : "Just now";
    if (hours < 24)
      return language === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`;
    if (days === 1) return language === "ar" ? "أمس" : "Yesterday";
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      label: t.questionsAsked,
      value: "12",
      icon: MessageSquare,
      change: "+3",
    },
    {
      label: t.savedConversations,
      value: "8",
      icon: FileText,
      change: "+2",
    },
    {
      label: t.documentsDownloaded,
      value: "5",
      icon: Download,
      change: "+1",
    },
  ];

  const quickActions = [
    {
      label: t.newQuestion,
      icon: Plus,
      href: "/chat",
      variant: "accent" as const,
    },
    {
      label: t.browseTemplates,
      icon: FileText,
      href: "/templates",
      variant: "default" as const,
    },
    {
      label: t.findLawyer,
      icon: Users,
      href: "/lawyers",
      variant: "default" as const,
    },
  ];

  return (
    <div
      className="flex min-h-screen bg-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          isRTL ? "right-0" : "left-0",
          sidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Scale className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              {language === "ar" ? "حقّي" : "Haqqi"}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              asChild
            >
              <Link href="/">
                <Home className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
                {t.home}
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start bg-sidebar-accent text-sidebar-foreground"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard
                  className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")}
                />
                {t.dashboard}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              asChild
            >
              <Link href="/settings">
                <Settings className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
                {t.settings}
              </Link>
            </Button>
          </div>
        </nav>

        {/* User Menu */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {language === "ar" ? "أ" : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {language === "ar" ? "أحمد حسن" : "Ahmed Hassan"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                ahmed@email.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
            {t.logout}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">
                {t.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {t.welcome}
              </h2>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-card-foreground">
                          {stat.value}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs text-accent"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Recent Conversations */}
              <div className="lg:col-span-2">
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-card-foreground">
                      {t.recentConversations}
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/chat"
                        className="text-accent hover:text-accent/80"
                      >
                        {t.viewAll}
                        <ArrowRight
                          className={cn(
                            "h-4 w-4",
                            isRTL ? "mr-1 rotate-180" : "ml-1"
                          )}
                        />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversations.map((conversation) => (
                        <Link
                          key={conversation.id}
                          href={`/chat?id=${conversation.id}`}
                          className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-medium text-card-foreground">
                              {conversation.title}
                            </h3>
                            <p className="truncate text-sm text-muted-foreground">
                              {conversation.preview}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(conversation.timestamp)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {conversation.messageCount}{" "}
                              {language === "ar" ? "رسائل" : "messages"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">
                      {t.quickActions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        className={cn(
                          "w-full justify-start",
                          action.variant === "accent"
                            ? "bg-accent text-accent-foreground hover:bg-accent/90"
                            : ""
                        )}
                        variant={
                          action.variant === "accent" ? "default" : "outline"
                        }
                        asChild
                      >
                        <Link href={action.href}>
                          <action.icon
                            className={cn(
                              "h-4 w-4",
                              isRTL ? "ml-2" : "mr-2"
                            )}
                          />
                          {action.label}
                        </Link>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Subscription Card */}
                <Card className="border-accent/50 bg-accent/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-accent" />
                      <CardTitle className="text-lg text-card-foreground">
                        {t.subscription}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="mb-3">
                      {t.freePlan}
                    </Badge>
                    <p className="mb-1 text-2xl font-bold text-card-foreground">
                      1 / 3
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t.questionsRemaining}
                    </p>
                    <p className="mb-4 text-xs text-muted-foreground">
                      {t.unlimitedAccess}
                    </p>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <Link href="/#pricing">{t.upgradeNow}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
