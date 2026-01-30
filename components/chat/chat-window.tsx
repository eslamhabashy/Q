"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Scale, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  language: "en" | "ar";
  suggestedQuestions: string[];
  onSuggestedQuestion: (question: string) => void;
}

export function ChatWindow({
  messages,
  isTyping,
  language,
  suggestedQuestions,
  onSuggestedQuestion,
}: ChatWindowProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      welcome: "Welcome to Qanunak",
      subtitle: "Your AI Legal Information Assistant",
      description:
        "Ask me any question about Egyptian law. I can help you understand your rights regarding rental agreements, employment contracts, family matters, and more.",
      suggested: "Popular Questions",
    },
    ar: {
      welcome: "مرحباً بك في قانونك",
      subtitle: "مساعدك الذكي للمعلومات القانونية",
      description:
        "اسألني أي سؤال عن القانون المصري. يمكنني مساعدتك في فهم حقوقك المتعلقة بعقود الإيجار وعقود العمل والشؤون الأسرية والمزيد.",
      suggested: "أسئلة شائعة",
    },
  };

  const t = content[language];

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* AI Avatar */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Scale className="h-10 w-10 text-primary" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-foreground">
            {t.welcome}
          </h2>
          <p className="mb-2 text-accent">{t.subtitle}</p>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            {t.description}
          </p>

          {/* Suggested Questions */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{t.suggested}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4",
              message.role === "user" && (isRTL ? "flex-row" : "flex-row-reverse")
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={cn(
                  message.role === "assistant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {message.role === "assistant" ? (
                  <Scale className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex-1 rounded-lg p-4",
                message.role === "assistant"
                  ? "bg-card"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none text-card-foreground dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
              <p
                className={cn(
                  "mt-2 text-xs",
                  message.role === "assistant"
                    ? "text-muted-foreground"
                    : "text-primary-foreground/70"
                )}
              >
                {message.timestamp.toLocaleTimeString(
                  language === "ar" ? "ar-EG" : "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Scale className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-lg bg-card p-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {language === "ar" ? "جاري الكتابة..." : "Typing..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
