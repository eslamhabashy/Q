"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft, Globe, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TermsOfServicePage() {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const isRTL = language === "ar";

    const content = {
        en: {
            title: "Terms of Service",
            lastUpdated: "Last Updated: January 30, 2024",
            back: "Back to Home",
            sections: [
                {
                    title: "1. Acceptance of Terms",
                    content: "By accessing and using Qanunak's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
                },
                {
                    title: "2. Description of Service",
                    content: "Qanunak provides an AI-powered legal information and advisory service specifically tailored to Egyptian law. Our service includes:\n\n• AI-powered legal consultations\n• Access to legal document templates\n• Connection to verified lawyers\n• Legal information resources\n\nOur service is for informational purposes only and does not constitute legal advice or create an attorney-client relationship.",
                },
                {
                    title: "3. User Accounts",
                    content: "To use certain features, you must create an account. You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All activities that occur under your account\n• Providing accurate and current information\n• Notifying us immediately of any unauthorized use",
                },
                {
                    title: "4. Subscription and Payment",
                    content: "Certain features require a paid subscription. By subscribing, you agree to:\n\n• Pay all applicable fees as described\n• Automatic renewal unless cancelled\n• Our refund policy as stated\n• Price changes with advance notice\n\nFree tier users are subject to daily usage limits.",
                },
                {
                    title: "5. Acceptable Use",
                    content: "You agree NOT to:\n\n• Use the service for illegal purposes\n• Attempt to gain unauthorized access to our systems\n• Share false or misleading information\n• Abuse, harass, or threaten others\n• Violate Egyptian laws or regulations\n• Use the service to provide legal advice to third parties without proper licensing",
                },
                {
                    title: "6. Intellectual Property",
                    content: "All content, features, and functionality of Qanunak are owned by us and protected by Egyptian and international copyright, trademark, and other intellectual property laws. You may not:\n\n• Copy, modify, or distribute our content without permission\n• Use our trademarks without authorization\n• Reverse engineer our AI models or systems",
                },
                {
                    title: "7. AI-Generated Content",
                    content: "Our AI provides information based on Egyptian law, but:\n\n• AI responses may contain errors or inaccuracies\n• AI cannot replace professional legal counsel\n• You should verify all information with a licensed attorney\n• We do not guarantee the accuracy of AI-generated content",
                },
                {
                    title: "8. Limitation of Liability",
                    content: "To the maximum extent permitted by Egyptian law:\n\n• We are not liable for any indirect, incidental, or consequential damages\n• Our total liability shall not exceed the amount you paid in the last 12 months\n• We do not guarantee uninterrupted or error-free service\n• We are not responsible for decisions you make based on our service",
                },
                {
                    title: "9. Indemnification",
                    content: "You agree to indemnify and hold Qanunak harmless from any claims, damages, or expenses arising from your use of the service or violation of these terms.",
                },
                {
                    title: "10. Termination",
                    content: "We reserve the right to suspend or terminate your account:\n\n• For violation of these terms\n• For illegal or fraudulent activity\n• For non-payment of fees\n• At your request\n\nUpon termination, your right to use the service immediately ceases.",
                },
                {
                    title: "11. Governing Law",
                    content: "These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be resolved in Egyptian courts.",
                },
                {
                    title: "12. Changes to Terms",
                    content: "We may modify these terms at any time. We will notify you of material changes via email or through the platform. Continued use after changes constitutes acceptance.",
                },
                {
                    title: "13. Contact Information",
                    content: "For questions about these Terms of Service:\n\nEmail: legal@qanunak.com\nAddress: Cairo, Egypt",
                },
            ],
        },
        ar: {
            title: "شروط الخدمة",
            lastUpdated: "آخر تحديث: 30 يناير 2024",
            back: "العودة للرئيسية",
            sections: [
                {
                    title: "1. قبول الشروط",
                    content: "باستخدام خدمات قانونك، فإنك تقبل وتوافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.",
                },
                {
                    title: "2. وصف الخدمة",
                    content: "يوفر قانونك خدمة معلومات واستشارات قانونية مدعومة بالذكاء الاصطناعي مصممة خصيصاً للقانون المصري. تشمل خدمتنا:\n\n• استشارات قانونية بالذكاء الاصطناعي\n• الوصول إلى نماذج المستندات القانونية\n• التواصل مع محامين موثقين\n• موارد المعلومات القانونية\n\nخدمتنا لأغراض إعلامية فقط ولا تشكل مشورة قانونية أو تنشئ علاقة محامي-موكل.",
                },
                {
                    title: "3. حسابات المستخدمين",
                    content: "لاستخدام ميزات معينة، يجب عليك إنشاء حساب. أنت مسؤول عن:\n\n• الحفاظ على سرية بيانات اعتماد حسابك\n• جميع الأنشطة التي تحدث تحت حسابك\n• توفير معلومات دقيقة وحديثة\n• إخطارنا فوراً بأي استخدام غير مصرح به",
                },
                {
                    title: "4. الاشتراك والدفع",
                    content: "تتطلب بعض الميزات اشتراكاً مدفوعاً. من خلال الاشتراك، فإنك توافق على:\n\n• دفع جميع الرسوم المعمول بها كما هو موضح\n• التجديد التلقائي ما لم يتم إلغاؤه\n• سياسة الاسترداد الخاصة بنا كما هو مذكور\n• تغييرات الأسعار مع إشعار مسبق\n\nمستخدمو المستوى المجاني يخضعون لحدود استخدام يومية.",
                },
                {
                    title: "5. الاستخدام المقبول",
                    content: "أنت توافق على عدم:\n\n• استخدام الخدمة لأغراض غير قانونية\n• محاولة الوصول غير المصرح به إلى أنظمتنا\n• مشاركة معلومات كاذبة أو مضللة\n• إساءة الاستخدام أو المضايقة أو التهديد للآخرين\n• انتهاك القوانين أو اللوائح المصرية\n• استخدام الخدمة لتقديم المشورة القانونية لأطراف ثالثة دون ترخيص مناسب",
                },
                {
                    title: "6. الملكية الفكرية",
                    content: "جميع المحتويات والميزات ووظائف قانونك مملوكة لنا ومحمية بموجب القوانين المصرية والدولية لحقوق النشر والعلامات التجارية والملكية الفكرية الأخرى. لا يجوز لك:\n\n• نسخ أو تعديل أو توزيع محتوانا دون إذن\n• استخدام علاماتنا التجارية دون تصريح\n• الهندسة العكسية لنماذج الذكاء الاصطناعي أو الأنظمة الخاصة بنا",
                },
                {
                    title: "7. المحتوى الناتج عن الذكاء الاصطناعي",
                    content: "يوفر الذكاء الاصطناعي لدينا معلومات بناءً على القانون المصري، ولكن:\n\n• قد تحتوي استجابات الذكاء الاصطناعي على أخطاء أو عدم دقة\n• لا يمكن للذكاء الاصطناعي أن يحل محل المشورة القانونية المهنية\n• يجب عليك التحقق من جميع المعلومات مع محامٍ مرخص\n• نحن لا نضمن دقة المحتوى الناتج عن الذكاء الاصطناعي",
                },
                {
                    title: "8. تحديد المسؤولية",
                    content: "إلى أقصى حد يسمح به القانون المصري:\n\n• نحن غير مسؤولين عن أي أضرار غير مباشرة أو عرضية أو تبعية\n• لن تتجاوز مسؤوليتنا الإجمالية المبلغ الذي دفعته في آخر 12 شهراً\n• نحن لا نضمن خدمة غير منقطعة أو خالية من الأخطاء\n• نحن غير مسؤولين عن القرارات التي تتخذها بناءً على خدمتنا",
                },
                {
                    title: "9. التعويض",
                    content: "أنت توافق على تعويض قانونك وحمايته من أي مطالبات أو أضرار أو نفقات ناشئة عن استخدامك للخدمة أو انتهاك هذه الشروط.",
                },
                {
                    title: "10. الإنهاء",
                    content: "نحتفظ بالحق في تعليق أو إنهاء حسابك:\n\n• لانتهاك هذه الشروط\n• للنشاط غير القانوني أو الاحتيالي\n• لعدم دفع الرسوم\n• بناءً على طلبك\n\nعند الإنهاء، يتوقف حقك في استخدام الخدمة فوراً.",
                },
                {
                    title: "11. القانون الحاكم",
                    content: "تخضع هذه الشروط لقوانين جمهورية مصر العربية. يتم حل أي نزاعات في المحاكم المصرية.",
                },
                {
                    title: "12. التغييرات على الشروط",
                    content: "قد نقوم بتعديل هذه الشروط في أي وقت. سنخطرك بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال المنصة. الاستمرار في الاستخدام بعد التغييرات يشكل قبولاً.",
                },
                {
                    title: "13. معلومات الاتصال",
                    content: "للأسئلة حول شروط الخدمة هذه:\n\nالبريد الإلكتروني: legal@qanunak.com\nالعنوان: القاهرة، مصر",
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
                            src={language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png"}
                            alt={language === "ar" ? "قانونك" : "Qanunak"}
                            className="h-8 w-auto"
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
