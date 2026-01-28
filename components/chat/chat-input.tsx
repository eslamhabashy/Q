"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  language: "en" | "ar";
  onSend: (message: string) => void;
}

export function ChatInput({ language, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const isRTL = language === "ar";

  const placeholder =
    language === "ar"
      ? "صف موقفك القانوني..."
      : "Describe your legal situation...";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "min-h-[52px] max-h-32 resize-none pr-12 bg-background",
              isRTL && "text-right"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!message.trim()}
          >
            <Send className={cn("h-4 w-4", isRTL && "rotate-180")} />
            <span className="sr-only">
              {language === "ar" ? "إرسال" : "Send"}
            </span>
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {language === "ar"
            ? "اضغط Enter للإرسال، Shift+Enter لسطر جديد"
            : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </form>
    </div>
  );
}
