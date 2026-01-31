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
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeModal } from "@/components/chat/upgrade-modal";
import { PaymentModal } from "@/components/payment/payment-modal";

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

  // Subscription Hook
  const {
    tier,
    dailyQuestionCount,
    dailyLimit,
    canAskQuestion,
    incrementQuestionCount,
    isExpired,
    checkSubscription
  } = useSubscription();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Modals state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("basic");

  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoQuestionsUsed, setDemoQuestionsUsed] = useState(0);
  const [showDemoSignupPrompt, setShowDemoSignupPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRTL = language === "ar";
  const isDark = theme === "dark";

  // Check if demo mode on mount
  useEffect(() => {
    if (!authLoading && !user) {
      // Enable demo mode for unauthenticated users
      setIsDemoMode(true);

      // Load demo state from localStorage
      const demoCount = localStorage.getItem('demo_questions_count');
      if (demoCount) {
        const count = parseInt(demoCount, 10);
        setDemoQuestionsUsed(count);

        // Load demo messages
        const demoMessages = localStorage.getItem('demo_messages');
        if (demoMessages) {
          try {
            const parsed = JSON.parse(demoMessages);
            setMessages(parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          } catch (e) {
            console.error('Error loading demo messages:', e);
          }
        }
      }
    } else if (user) {
      setIsDemoMode(false);
    }
  }, [user, authLoading]);

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleError = (error: any) => {
    console.error("AI Response Error:", error);
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: language === "ar"
        ? "عذراً، حدث خطأ في الحصول على الرد. هل يمكنك إعادة صياغة سؤالك؟"
        : "Sorry, there was an error getting a response. Could you rephrase your question?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  };

  const simulateAIResponse = async (userMessage: string, conversationId: string) => {
    setIsTyping(true);

    try {
      // Build conversation history (limit to last 10 messages for context)
      const conversationHistory = messages
        .slice(-10) // Last 10 messages to avoid token overflow
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call Gemini API with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          history: conversationHistory, // Include conversation context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      if (!data.success || !data.response) {
        throw new Error('Invalid response from AI');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save AI message to database
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: data.response,
        });

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      handleError(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDemoMessage = async (content: string) => {
    // Check demo limit
    if (demoQuestionsUsed >= 3) {
      setShowDemoSignupPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update demo count
    const newCount = demoQuestionsUsed + 1;
    setDemoQuestionsUsed(newCount);
    localStorage.setItem('demo_questions_count', newCount.toString());

    // Save messages to localStorage
    localStorage.setItem('demo_messages', JSON.stringify(updatedMessages));

    // Show typing indicator
    setIsTyping(true);

    try {
      // Build history for AI
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call API without authentication
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          language,
          history,
          isDemoMode: true
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      localStorage.setItem('demo_messages', JSON.stringify(finalMessages));

      // Show signup prompt if this was the 3rd question
      if (newCount >= 3) {
        setTimeout(() => setShowDemoSignupPrompt(true), 1000);
      }
    } catch (error) {
      console.error('Demo chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "ar"
          ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
          : "Sorry, an error occurred. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // Check daily limit and subscription status using hook
    if (!canAskQuestion) {
      setShowUpgradeModal(true);
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

      // Increment message count using hook
      await incrementQuestionCount();

      // Generate AI response - conversationId is guaranteed to be string at this point
      if (conversationId) {
        await simulateAIResponse(content, conversationId);
      }


    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      handleError(error);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isDemoMode) {
      handleDemoMessage(question);
    } else {
      handleSendMessage(question);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  const handleSelectConversation = (conversationId: string) => {
    const selectedConv = conversations.find(c => c.id === conversationId);
    if (selectedConv) {
      setActiveConversationId(conversationId);
      setMessages(selectedConv.messages);
      setSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  const handleUpgradeSelect = (tier: string) => {
    setSelectedTier(tier);
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const t = {
    title: language === "ar" ? "قانونك" : "Qanunak",
  };

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
        activeConversationId={activeConversationId}
        // Show demo remaining for demo mode, or tier-based remaining for authenticated
        remainingQuestions={isDemoMode ? (3 - demoQuestionsUsed) : (dailyLimit === Infinity ? 999 : (dailyLimit - dailyQuestionCount))}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-h-0">
        {/* Chat Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shrink-0">
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
              <img
                src={theme === "dark" ? "/logos/logo-dark.png" : (language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png")}
                alt={language === "ar" ? "قانونك" : "Qanunak"}
                className="h-16 w-auto"
              />
              <span className="sr-only">{t.title}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Question Counter (Demo or Free/Basic) */}
            {(isDemoMode || (tier !== 'premium' && dailyLimit !== Infinity)) && (
              <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                {language === "ar"
                  ? `${isDemoMode ? (3 - demoQuestionsUsed) : Math.max(0, dailyLimit - dailyQuestionCount)} أسئلة متبقية`
                  : `${isDemoMode ? (3 - demoQuestionsUsed) : Math.max(0, dailyLimit - dailyQuestionCount)} questions left`}
              </div>
            )}

            {/* Upgrade Button for Free/Basic Users */}
            {!isDemoMode && tier !== 'premium' && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex gap-1 text-xs h-8 border-primary text-primary hover:bg-primary/10"
                onClick={() => setShowUpgradeModal(true)}
              >
                <Scale className="h-3 w-3" />
                {language === "ar" ? "ترقية الخطة" : "Upgrade Plan"}
              </Button>
            )}

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
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            language={language}
            suggestedQuestions={suggestedQuestions[language]}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="shrink-0">
          <ChatInput
            language={language}
            onSend={isDemoMode ? handleDemoMessage : handleSendMessage}
          />
        </div>

        {/* Demo Signup Prompt Modal */}
        {showDemoSignupPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                {language === "ar" ? "🎉 لقد جربت قانونك!" : "🎉 You've Tried Qanunak!"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "ar"
                  ? "لقد استخدمت أسئلتك التجريبية الثلاثة المجانية. قم بالتسجيل الآن للحصول على:"
                  : "You've used your 3 free demo questions. Sign up now to get:"}
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{language === "ar" ? "أسئلة غير محدودة يومياً" : "Unlimited daily questions"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{language === "ar" ? "حفظ سجل المحادثات" : "Conversation history saved"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{language === "ar" ? "الوصول إلى قوالب المستندات" : "Access to document templates"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{language === "ar" ? "التواصل مع محامين موثقين" : "Connect with verified lawyers"}</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/signup')}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  {language === "ar" ? "إنشاء حساب مجاني" : "Sign Up Free"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="flex-1"
                >
                  {language === "ar" ? "تسجيل الدخول" : "Log In"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgradeSelect}
          currentTier={tier}
          currentUsage={dailyQuestionCount}
          dailyLimit={dailyLimit}
          reason={isExpired ? "subscription_expired" : "limit_reached"}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          preselectedTier={selectedTier}
        />
      </div>
    </div>
  );
}
