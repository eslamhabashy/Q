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
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState(3);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRTL = language === "ar";
  const isDark = theme === "dark";

  // Redirect if not authenticated (backup to middleware)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/chat');
    }
  }, [user, authLoading, router]);

  // Load user conversations from Supabase
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      // Transform database conversations to UI format
      const transformedConversations: Conversation[] = await Promise.all(
        (data || []).map(async (conv) => {
          // Load messages for this conversation
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          const messages: Message[] = (messagesData || []).map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));

          // Generate preview from first user message
          const firstUserMessage = messages.find(m => m.role === 'user');
          const preview = firstUserMessage
            ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
            : 'New conversation';

          return {
            id: conv.id,
            title: conv.title,
            preview,
            timestamp: new Date(conv.updated_at),
            messages,
          };
        })
      );

      setConversations(transformedConversations);

      // Set active conversation if we have one
      if (transformedConversations.length > 0 && !activeConversationId) {
        setActiveConversationId(transformedConversations[0].id);
        setMessages(transformedConversations[0].messages);
      }
    };

    loadConversations();
  }, [user, supabase]);

  // Load and check user's daily usage
  useEffect(() => {
    if (!user) return;

    const checkDailyUsage = async () => {
      try {
        // Call the check_and_reset_daily_usage function
        const { data, error } = await supabase.rpc('check_and_reset_daily_usage', {
          p_user_id: user.id
        });

        if (error) {
          console.error('Error checking daily usage:', error);
          return;
        }

        if (data && data.length > 0) {
          const usage = data[0];
          const remaining = Math.max(0, 3 - usage.messages_sent);
          setRemainingQuestions(remaining);
          setIsSubscribed(usage.is_subscribed);

          // Show prompt if limit reached and not subscribed
          if (remaining === 0 && !usage.is_subscribed) {
            setShowSubscriptionPrompt(true);
          }
        }
      } catch (error) {
        console.error('Error in checkDailyUsage:', error);
      }
    };

    checkDailyUsage();
  }, [user, supabase]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const simulateAIResponse = async (userMessage: string, conversationId: string) => {
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

    setTimeout(async () => {
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

      // Update UI
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Save AI message to database
      try {
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: response,
          });

        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } catch (error) {
        console.error('Error saving AI message:', error);
      }
    }, 1500);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // Check daily limit (unless subscribed)
    if (!isSubscribed && remainingQuestions <= 0) {
      setShowSubscriptionPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);

    try {
      let conversationId = activeConversationId;

      // Create new conversation if none exists
      if (!conversationId) {
        // Generate title from first message
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');

        console.log('Attempting to create conversation with user_id:', user.id);

        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: title,
          })
          .select()
          .single();

        if (convError) {
          console.error('Error creating conversation:', convError);
          console.error('Error details:', JSON.stringify(convError, null, 2));
          console.error('Error message:', convError.message);
          console.error('Error code:', convError.code);
          return;
        }

        console.log('Conversation created successfully:', newConv);

        conversationId = newConv.id;
        setActiveConversationId(conversationId);

        // Add to conversations list
        const newConversation: Conversation = {
          id: conversationId,
          title: title,
          preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          timestamp: new Date(),
          messages: [userMessage],
        };
        setConversations((prev) => [newConversation, ...prev]);
      } else {
        // Update existing conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      // Save user message to database
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: content,
        });

      if (msgError) {
        console.error('Error saving user message:', msgError);
        return;
      }

      // Increment message count in database (unless subscribed)
      if (!isSubscribed) {
        try {
          const { data: newCount, error: countError } = await supabase.rpc('increment_message_count', {
            p_user_id: user.id
          });

          if (!countError && newCount !== null) {
            const remaining = Math.max(0, 3 - newCount);
            setRemainingQuestions(remaining);

            // Show subscription prompt if limit reached
            if (remaining === 0) {
              setShowSubscriptionPrompt(true);
            }
          }
        } catch (error) {
          console.error('Error incrementing message count:', error);
        }
      }

      // Generate AI response - conversationId is guaranteed to be string at this point
      if (conversationId) {
        await simulateAIResponse(content, conversationId);
      }


    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  const content = {
    en: {
      title: "Qanunak",
      newChat: "New Chat",
      requestLawyer: "Request Lawyer Review",
    },
    ar: {
      title: "قانونك",
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

        {/* Subscription Prompt Modal */}
        {showSubscriptionPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSubscriptionPrompt(false)}>
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">
                {language === "ar" ? "لقد وصلت إلى الحد اليومي" : "Daily Limit Reached"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "ar"
                  ? "لقد استخدمت جميع الرسائل المجانية الثلاث لليوم. اشترك للحصول على رسائل غير محدودة والمزيد من الميزات!"
                  : "You've used all 3 free messages for today. Subscribe for unlimited messages and premium features!"}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/pricing')}
                  className="flex-1"
                >
                  {language === "ar" ? "عرض الخطط" : "View Plans"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSubscriptionPrompt(false)}
                  className="flex-1"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
