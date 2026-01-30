"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft, Globe, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrivacyPolicyPage() {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const isRTL = language === "ar";

    const content = {
        en: {
            title: "Privacy Policy",
            lastUpdated: "Last Updated: January 30, 2024",
            back: "Back to Home",
            sections: [
                {
                    title: "1. Introduction",
                    content: "Welcome to Qanunak. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our AI-powered legal advisor service.",
                },
                {
                    title: "2. Information We Collect",
                    content: "We collect information that you provide directly to us, including:\n\n• Account information (name, email address, phone number)\n• Chat conversations and legal queries\n• Payment information (processed securely through third-party providers)\n• Usage data and analytics\n• Device and browser information",
                },
                {
                    title: "3. How We Use Your Information",
                    content: "We use your information to:\n\n• Provide and improve our legal advisory services\n• Respond to your legal questions using AI\n• Process your payments and subscriptions\n• Send important updates and notifications\n• Analyze usage patterns to enhance user experience\n• Comply with legal obligations",
                },
                {
                    title: "4. Data Security",
                    content: "We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest. We use secure authentication protocols and regularly update our security practices. However, no method of transmission over the internet is 100% secure.",
                },
                {
                    title: "5. Data Sharing",
                    content: "We do not sell your personal information. We may share your data only:\n\n• With your explicit consent\n• With service providers who assist in our operations\n• When required by Egyptian law or legal process\n• To protect our rights and prevent fraud",
                },
                {
                    title: "6. Your Rights",
                    content: "Under Egyptian data protection regulations, you have the right to:\n\n• Access your personal data\n• Correct inaccurate information\n• Request deletion of your data\n• Object to data processing\n• Export your data\n• Withdraw consent at any time",
                },
                {
                    title: "7. Cookies and Tracking",
                    content: "We use essential cookies to provide our services and analytics cookies to improve user experience. You can control cookie settings through your browser preferences.",
                },
                {
                    title: "8. Children's Privacy",
                    content: "Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.",
                },
                {
                    title: "9. Changes to This Policy",
                    content: "We may update this privacy policy from time to time. We will notify you of significant changes via email or through our platform.",
                },
                {
                    title: "10. Contact Us",
                    content: "If you have questions about this privacy policy or your personal data, please contact us at:\n\nEmail: privacy@qanunak.com\nAddress: Cairo, Egypt",
                },
            ],
        },
        ar: {
            title: "سياسة الخصوصية",
            lastUpdated: "آخر تحديث: 30 يناير 2024",
            back: "العودة للرئيسية",
            sections: [
                {
                    title: "1. المقدمة",
                    content: "مرحباً بك في قانونك. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها وحمايتها عند استخدام خدمة المستشار القانوني المدعوم بالذكاء الاصطناعي.",
                },
                {
                    title: "2. المعلومات التي نجمعها",
                    content: "نجمع المعلومات التي تقدمها لنا مباشرة، بما في ذلك:\n\n• معلومات الحساب (الاسم، عنوان البريد الإلكتروني، رقم الهاتف)\n• محادثات الدردشة والاستفسارات القانونية\n• معلومات الدفع (تتم معالجتها بشكل آمن من خلال مزودي خدمة خارجيين)\n• بيانات الاستخدام والتحليلات\n• معلومات الجهاز والمتصفح",
                },
                {
                    title: "3. كيفية استخدام معلوماتك",
                    content: "نستخدم معلوماتك من أجل:\n\n• تقديم وتحسين خدماتنا الاستشارية القانونية\n• الرد على أسئلتك القانونية باستخدام الذكاء الاصطناعي\n• معالجة المدفوعات والاشتراكات\n• إرسال التحديثات والإشعارات الهامة\n• تحليل أنماط الاستخدام لتحسين تجربة المستخدم\n• الامتثال للالتزامات القانونية",
                },
                {
                    title: "4. أمن البيانات",
                    content: "نطبق تدابير أمنية قياسية في الصناعة لحماية معلوماتك الشخصية. يتم تشفير جميع البيانات أثناء النقل وفي حالة الراحة. نستخدم بروتوكولات مصادقة آمنة ونحدث ممارساتنا الأمنية بانتظام. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100%.",
                },
                {
                    title: "5. مشاركة البيانات",
                    content: "نحن لا نبيع معلوماتك الشخصية. قد نشارك بياناتك فقط:\n\n• بموافقتك الصريحة\n• مع مزودي الخدمة الذين يساعدون في عملياتنا\n• عند الاقتضاء بموجب القانون المصري أو الإجراءات القانونية\n• لحماية حقوقنا ومنع الاحتيال",
                },
                {
                    title: "6. حقوقك",
                    content: "بموجب لوائح حماية البيانات المصرية، لديك الحق في:\n\n• الوصول إلى بياناتك الشخصية\n• تصحيح المعلومات غير الدقيقة\n• طلب حذف بياناتك\n• الاعتراض على معالجة البيانات\n• تصدير بياناتك\n• سحب الموافقة في أي وقت",
                },
                {
                    title: "7. ملفات تعريف الارتباط والتتبع",
                    content: "نستخدم ملفات تعريف الارتباط الأساسية لتقديم خدماتنا وملفات تعريف الارتباط التحليلية لتحسين تجربة المستخدم. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال تفضيلات المتصفح الخاص بك.",
                },
                {
                    title: "8. خصوصية الأطفال",
                    content: "خدماتنا غير مخصصة للأفراد الذين تقل أعمارهم عن 18 عاماً. نحن لا نجمع عن قصد معلومات شخصية من الأطفال.",
                },
                {
                    title: "9. التغييرات على هذه السياسة",
                    content: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بالتغييرات الهامة عبر البريد الإلكتروني أو من خلال منصتنا.",
                },
                {
                    title: "10. اتصل بنا",
                    content: "إذا كانت لديك أسئلة حول سياسة الخصوصية هذه أو بياناتك الشخصية، يرجى الاتصال بنا على:\n\nالبريد الإلكتروني: privacy@qanunak.com\nالعنوان: القاهرة، مصر",
                },
            ],
        },
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">
                                <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180", isRTL ? "ml-2" : "mr-2")} />
                                {t.back}
                            </Link>
                        </Button>
                    </div>

                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src={theme === "dark" ? "/logos/logo-dark.png" : (language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png")}
                            alt={language === "ar" ? "قانونك" : "Qanunak"}
                            className="h-20 w-auto"
                        />
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                        >
                            <Globe className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
                        {t.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{t.lastUpdated}</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {t.sections.map((section, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="mb-3 text-xl font-semibold text-foreground">
                                {section.title}
                            </h2>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
