"use client";

import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { DisclaimerBanner } from "@/components/chat/disclaimer-banner";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X, Globe, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: Message[];
}

const suggestedQuestions = {
  en: [
    "Rental rights in Egypt",
    "How to file for divorce",
    "Employment contract review",
    "Starting a business",
    "Traffic violation appeal",
    "Tenant eviction process",
  ],
  ar: [
    "حقوق الإيجار في مصر",
    "كيفية رفع دعوى طلاق",
    "مراجعة عقد العمل",
    "بدء مشروع تجاري",
    "الطعن في مخالفة مرور",
    "إجراءات إخلاء المستأجر",
  ],
};


export default function ChatPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Rental Agreement Question",
      preview: "What are my rights as a tenant if...",
      timestamp: new Date(Date.now() - 86400000),
      messages: [],
    },
    {
      id: "2",
      title: "Employment Contract",
      preview: "Is it legal for my employer to...",
      timestamp: new Date(Date.now() - 172800000),
      messages: [],
    },
  ]);
  const [remainingQuestions, setRemainingQuestions] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRTL = language === "ar";
  const isDark = theme === "dark";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    const responses = {
      en: {
        rental: `Based on Egyptian Rent Law (Law No. 4 of 1996), as a tenant you have the following rights:

**1. Right to a Written Contract**
You're entitled to a written rental agreement that specifies the rent amount, duration, and terms.

**2. Rent Increase Limitations**
For old-law rentals, rent increases are regulated and cannot exceed certain percentages annually.

**3. Notice Period**
Your landlord must provide proper notice (typically 3 months) before termination.

**4. Essential Services**
You have the right to functioning utilities and basic maintenance.

**5. Security Deposit**
Your deposit must be returned when you vacate, minus any legitimate damages.

Would you like more details on any of these points, or do you have a specific rental situation you'd like me to address?

*Note: This is general legal information. For advice on your specific situation, please consult a licensed attorney.*`,
        divorce: `Filing for divorce in Egypt follows different procedures based on religion (Muslim, Christian, etc.). Here's an overview for Muslim divorces:

**Types of Divorce:**

**1. Talaq (Husband-initiated)**
- Husband can pronounce divorce unilaterally
- Must be registered at the Personal Status Court
- Wife is entitled to Mut'a (compensation) and deferred dowry

**2. Khul' (Wife-initiated)**
- Wife can request divorce in exchange for returning dowry
- Court process typically takes 3-6 months
- Available since Law 1 of 2000

**3. Judicial Divorce**
- Wife can seek divorce based on harm, non-support, or absence
- Requires proving grounds before the court

**Required Documents:**
- Marriage certificate
- National ID cards
- Birth certificates of children (if any)

Would you like more information about a specific type of divorce or the custody arrangements that follow?

*Note: This is general legal information. Please consult a licensed attorney for your specific situation.*`,
        default: `Thank you for your question. I'll help you understand your legal rights under Egyptian law.

To provide you with the most accurate information, could you please share more details about your specific situation? For example:

- What type of legal matter is this (employment, rental, family, business)?
- What city or governorate are you in?
- Are there any deadlines or urgent timeframes?

Once I have more context, I can provide relevant information about:
- Applicable Egyptian laws and regulations
- Your basic rights in this situation
- Recommended next steps
- When to consult a licensed attorney

*Remember: This is educational legal information, not legal advice. For your specific case, always consult a licensed attorney.*`,
      },
      ar: {
        rental: `بناءً على قانون الإيجار المصري (القانون رقم 4 لسنة 1996)، كمستأجر لديك الحقوق التالية:

**1. الحق في عقد مكتوب**
يحق لك الحصول على عقد إيجار مكتوب يحدد قيمة الإيجار والمدة والشروط.

**2. قيود زيادة الإيجار**
بالنسبة للإيجارات القديمة، تكون زيادات الإيجار منظمة ولا يمكن أن تتجاوز نسباً معينة سنوياً.

**3. فترة الإخطار**
يجب على المؤجر تقديم إخطار مناسب (عادة 3 أشهر) قبل الإنهاء.

**4. الخدمات الأساسية**
لديك الحق في المرافق العاملة والصيانة الأساسية.

**5. التأمين**
يجب إعادة التأمين عند إخلاء العقار، مطروحاً منه أي أضرار مشروعة.

هل تريد المزيد من التفاصيل حول أي من هذه النقاط، أو لديك موقف إيجاري محدد تريد مني معالجته؟

*ملاحظة: هذه معلومات قانونية عامة. للحصول على استشارة لحالتك المحددة، يرجى استشارة محامٍ مرخص.*`,
        default: `شكراً لسؤالك. سأساعدك على فهم حقوقك القانونية بموجب القانون المصري.

لتقديم أدق المعلومات لك، هل يمكنك مشاركة المزيد من التفاصيل حول موقفك المحدد؟ على سبيل المثال:

- ما نوع المسألة القانونية (عمل، إيجار، أسرة، أعمال)؟
- في أي مدينة أو محافظة أنت؟
- هل هناك مواعيد نهائية أو أطر زمنية عاجلة؟

بمجرد أن أحصل على مزيد من السياق، يمكنني تقديم معلومات ذات صلة حول:
- القوانين واللوائح المصرية المعمول بها
- حقوقك الأساسية في هذا الموقف
- الخطوات التالية الموصى بها
- متى تستشير محامياً مرخصاً

*تذكر: هذه معلومات قانونية تعليمية، وليست استشارة قانونية. لحالتك المحددة، استشر دائماً محامياً مرخصاً.*`,
      },
    };

    setTimeout(() => {
      const content = responses[language];
      let response = content.default;

      const lowerMessage = userMessage.toLowerCase();
      if (
        lowerMessage.includes("rent") ||
        lowerMessage.includes("tenant") ||
        lowerMessage.includes("landlord") ||
        lowerMessage.includes("إيجار") ||
        lowerMessage.includes("مستأجر")
      ) {
        response = content.rental;
      } else if (
        (lowerMessage.includes("divorce") || lowerMessage.includes("طلاق")) &&
        "divorce" in content
      ) {
        // @ts-ignore
        response = content.divorce || content.default;
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setRemainingQuestions((prev) => Math.max(0, prev - 1));
    simulateAIResponse(content);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const content = {
    en: {
      title: "Haqqi",
      newChat: "New Chat",
      requestLawyer: "Request Lawyer Review",
    },
    ar: {
      title: "حقّي",
      newChat: "محادثة جديدة",
      requestLawyer: "طلب مراجعة محامٍ",
    },
  };

  const t = content[language];

  return (
    <div
      className="flex h-screen bg-background"
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
      <ChatSidebar
        language={language}
        conversations={conversations}
        remainingQuestions={remainingQuestions}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-card-foreground">
                {t.title}
              </span>
            </Link>
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

        {/* Disclaimer Banner */}
        <DisclaimerBanner language={language} />

        {/* Chat Messages */}
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          language={language}
          suggestedQuestions={suggestedQuestions[language]}
          onSuggestedQuestion={handleSuggestedQuestion}
        />
        <div ref={messagesEndRef} />

        {/* Chat Input */}
        <ChatInput language={language} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
