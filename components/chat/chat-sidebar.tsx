"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MessageSquare,
  FileText,
  Users,
  Crown,
  X,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  language: "en" | "ar";
  conversations: Conversation[];
  activeConversationId: string | null;
  remainingQuestions: number;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatSidebar({
  language,
  conversations,
  activeConversationId,
  remainingQuestions,
  isOpen,
  onClose,
  onNewChat,
  onSelectConversation,
}: ChatSidebarProps) {
  const isRTL = language === "ar";
  const { theme } = useTheme();

  const content = {
    en: {
      newChat: "New Chat",
      history: "Conversation History",
      templates: "Document Templates",
      lawyers: "Find a Lawyer",
      remaining: "questions remaining",
      upgrade: "Upgrade to Basic",
      unlimited: "Get unlimited questions",
    },
    ar: {
      newChat: "محادثة جديدة",
      history: "سجل المحادثات",
      templates: "نماذج المستندات",
      lawyers: "ابحث عن محامي",
      remaining: "أسئلة متبقية",
      upgrade: "الترقية للباقة الأساسية",
      unlimited: "احصل على أسئلة غير محدودة",
    },
  };

  const t = content[language];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return language === "ar" ? "اليوم" : "Today";
    if (days === 1) return language === "ar" ? "أمس" : "Yesterday";
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
        isRTL ? "right-0" : "left-0",
        isOpen
          ? "translate-x-0"
          : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src={theme === "dark" ? "/logos/logo-dark.png" : (language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png")}
            alt={language === "ar" ? "قانونك" : "Qanunak"}
            className="h-10 w-auto"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={onNewChat}
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t.newChat}
        </Button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            {t.history}
          </h3>
        </div>
        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="space-y-1 px-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-colors",
                  activeConversationId === conversation.id
                    ? "bg-sidebar-accent border border-sidebar-primary/20"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 shrink-0 text-sidebar-foreground/60" />
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {conversation.title}
                  </span>
                </div>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {conversation.preview}
                </p>
                <p className="text-xs text-sidebar-foreground/40">
                  {formatDate(conversation.timestamp)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Links */}
      <div className="border-t border-sidebar-border p-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            asChild
          >
            <Link href="/templates">
              <FileText className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t.templates}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            asChild
          >
            <Link href="/lawyers">
              <Users className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t.lawyers}
            </Link>
          </Button>
        </div>
      </div>

      {/* Remaining Questions / Upgrade */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <div className="mb-2 flex items-center gap-2 text-sidebar-foreground">
            <Crown className="h-4 w-4 text-accent" />
            <span className="font-medium">
              {remainingQuestions} {t.remaining}
            </span>
          </div>
          <p className="mb-3 text-xs text-sidebar-foreground/60">
            {t.unlimited}
          </p>
          <Button
            size="sm"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <Link href="/#pricing">{t.upgrade}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
