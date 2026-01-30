"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale, ArrowLeft, Globe, Moon, Sun, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DisclaimerPage() {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const isRTL = language === "ar";

    const content = {
        en: {
            title: "Legal Disclaimer",
            lastUpdated: "Last Updated: January 30, 2024",
            back: "Back to Home",
            warning: "IMPORTANT NOTICE",
            warningText: "Please read this disclaimer carefully before using Qanunak's services. By using our platform, you acknowledge and agree to the terms outlined below.",
            sections: [
                {
                    title: "1. Not Legal Advice",
                    content: "The information provided by Qanunak, including AI-generated responses, document templates, and legal information resources, is for general informational and educational purposes only. It does NOT constitute legal advice and should NOT be relied upon as such.\n\nQanunak does not create an attorney-client relationship between you and our service or any lawyer featured on our platform unless you separately engage their services.",
                },
                {
                    title: "2. AI Limitations",
                    content: "Our AI-powered legal assistant uses advanced technology to provide information based on Egyptian law, but:\n\n• AI can make mistakes and provide inaccurate information\n• AI cannot understand the full context of your specific situation\n• AI-generated content may become outdated as laws change\n• AI cannot replace professional legal judgment\n• AI responses should be verified with a licensed attorney",
                },
                {
                    title: "3. No Guarantee of Accuracy",
                    content: "While we strive to provide accurate and up-to-date information:\n\n• We make no warranties about the accuracy, completeness, or reliability of any information\n• Egyptian laws and regulations change frequently\n• Legal interpretations may vary\n• Information may not apply to your specific circumstances\n• We are not responsible for any errors or omissions",
                },
                {
                    title: "4. Professional Legal Counsel Required",
                    content: "You should ALWAYS consult with a qualified, licensed attorney before:\n\n• Making legal decisions\n• Signing legal documents\n• Representing yourself in legal proceedings\n• Taking action that could affect your legal rights\n• Entering into contracts or agreements\n\nOnly a licensed attorney who understands your specific situation can provide proper legal advice.",
                },
                {
                    title: "5. Document Templates",
                    content: "Our document templates are generic forms that:\n\n• May not be suitable for your specific needs\n• Require customization by a legal professional\n• Should be reviewed by an attorney before use\n• May not comply with all applicable laws and regulations\n• Are provided as-is without warranty\n\nUsing a template without legal review may result in invalid or unenforceable documents.",
                },
                {
                    title: "6. Third-Party Lawyers",
                    content: "Lawyers listed on our platform are independent professionals. Qanunak:\n\n• Does not endorse or guarantee any lawyer's services\n• Is not responsible for lawyer conduct or advice\n• Does not participate in attorney-client relationships\n• Cannot guarantee specific outcomes\n• Verification status indicates identity confirmation only, not quality of service",
                },
                {
                    title: "7. Limitation of Liability",
                    content: "To the fullest extent permitted by Egyptian law:\n\n• Qanunak and its affiliates are not liable for any damages arising from your use of our service\n• We are not responsible for decisions you make based on information from our platform\n• We are not liable for any legal consequences of using our services\n• Your use of our service is entirely at your own risk",
                },
                {
                    title: "8. Jurisdiction and Venue",
                    content: "This disclaimer is governed by the laws of the Arab Republic of Egypt. The information provided is based on Egyptian law and may not be applicable in other jurisdictions.",
                },
                {
                    title: "9. No Emergency Service",
                    content: "Qanunak is NOT an emergency service. If you have an urgent legal matter:\n\n• Contact a lawyer immediately\n• Seek emergency legal assistance through proper channels\n• Do not rely on our AI for time-sensitive matters\n• Call relevant authorities if you're in immediate danger",
                },
                {
                    title: "10. User Responsibility",
                    content: "By using Qanunak, you acknowledge that:\n\n• You understand this is not legal advice\n• You will seek professional legal counsel for your specific needs\n• You are responsible for verifying all information\n• You accept full responsibility for your legal decisions\n• You will not rely solely on AI-generated information for legal matters",
                },
                {
                    title: "11. Changes to Disclaimer",
                    content: "We reserve the right to modify this disclaimer at any time. Continued use of our service after changes constitutes acceptance of the modified disclaimer.",
                },
                {
                    title: "12. Contact for Legal Matters",
                    content: "This disclaimer does not waive any rights or defenses. For legal questions specific to your situation, consult a licensed attorney.\n\nFor questions about this disclaimer:\nEmail: legal@qanunak.com",
                },
            ],
        },
        ar: {
            title: "إخلاء المسؤولية القانونية",
            lastUpdated: "آخر تحديث: 30 يناير 2024",
            back: "العودة للرئيسية",
            warning: "إشعار مهم",
            warningText: "يرجى قراءة إخلاء المسؤولية هذا بعناية قبل استخدام خدمات قانونك. باستخدام منصتنا، فإنك تقر وتوافق على الشروط الموضحة أدناه.",
            sections: [
                {
                    title: "1. ليست مشورة قانونية",
                    content: "المعلومات المقدمة من قانونك، بما في ذلك الاستجابات التي ينشئها الذكاء الاصطناعي ونماذج المستندات وموارد المعلومات القانونية، هي لأغراض إعلامية وتعليمية عامة فقط. إنها لا تشكل مشورة قانونية ولا ينبغي الاعتماد عليها على هذا النحو.\n\nلا ينشئ قانونك علاقة محامي-موكل بينك وبين خدمتنا أو أي محامٍ معروض على منصتنا ما لم تتعاقد معهم بشكل منفصل.",
                },
                {
                    title: "2. قيود الذكاء الاصطناعي",
                    content: "يستخدم مساعدنا القانوني المدعوم بالذكاء الاصطناعي تقنية متقدمة لتقديم معلومات بناءً على القانون المصري، ولكن:\n\n• يمكن للذكاء الاصطناعي أن يرتكب أخطاء ويقدم معلومات غير دقيقة\n• لا يمكن للذكاء الاصطناعي فهم السياق الكامل لموقفك المحدد\n• قد يصبح المحتوى الناتج عن الذكاء الاصطناعي قديماً مع تغير القوانين\n• لا يمكن للذكاء الاصطناعي أن يحل محل الحكم القانوني المهني\n• يجب التحقق من استجابات الذكاء الاصطناعي مع محامٍ مرخص",
                },
                {
                    title: "3. عدم ضمان الدقة",
                    content: "بينما نسعى لتقديم معلومات دقيقة ومحدثة:\n\n• لا نقدم أي ضمانات حول دقة أو اكتمال أو موثوقية أي معلومات\n• تتغير القوانين واللوائح المصرية بشكل متكرر\n• قد تختلف التفسيرات القانونية\n• قد لا تنطبق المعلومات على ظروفك المحددة\n• نحن غير مسؤولين عن أي أخطاء أو سهو",
                },
                {
                    title: "4. المشورة القانونية المهنية مطلوبة",
                    content: "يجب عليك دائماً استشارة محامٍ مؤهل ومرخص قبل:\n\n• اتخاذ قرارات قانونية\n• التوقيع على مستندات قانونية\n• تمثيل نفسك في إجراءات قانونية\n• اتخاذ إجراء قد يؤثر على حقوقك القانونية\n• الدخول في عقود أو اتفاقيات\n\nفقط المحامي المرخص الذي يفهم وضعك المحدد يمكنه تقديم المشورة القانونية المناسبة.",
                },
                {
                    title: "5. نماذج المستندات",
                    content: "نماذج المستندات الخاصة بنا هي نماذج عامة:\n\n• قد لا تكون مناسبة لاحتياجاتك المحددة\n• تتطلب التخصيص من قبل متخصص قانوني\n• يجب مراجعتها من قبل محامٍ قبل الاستخدام\n• قد لا تتوافق مع جميع القوانين واللوائح المعمول بها\n• يتم توفيرها كما هي دون ضمان\n\nقد يؤدي استخدام نموذج دون مراجعة قانونية إلى مستندات غير صالحة أو غير قابلة للتنفيذ.",
                },
                {
                    title: "6. المحامون من الأطراف الثالثة",
                    content: "المحامون المدرجون على منصتنا هم محترفون مستقلون. قانونك:\n\n• لا يوصي أو يضمن خدمات أي محامٍ\n• غير مسؤول عن سلوك أو مشورة المحامي\n• لا يشارك في علاقات المحامي-الموكل\n• لا يمكنه ضمان نتائج محددة\n• حالة التحقق تشير فقط إلى تأكيد الهوية، وليس جودة الخدمة",
                },
                {
                    title: "7. تحديد المسؤولية",
                    content: "إلى أقصى حد يسمح به القانون المصري:\n\n• قانونك والشركات التابعة لها غير مسؤولين عن أي أضرار ناشئة عن استخدامك لخدمتنا\n• نحن غير مسؤولين عن القرارات التي تتخذها بناءً على معلومات من منصتنا\n• نحن غير مسؤولين عن أي عواقب قانونية لاستخدام خدماتنا\n• استخدامك لخدمتنا يكون بالكامل على مسؤوليتك الخاصة",
                },
                {
                    title: "8. الاختصاص والمكان",
                    content: "يخضع إخلاء المسؤولية هذا لقوانين جمهورية مصر العربية. المعلومات المقدمة تستند إلى القانون المصري وقد لا تكون قابلة للتطبيق في ولايات قضائية أخرى.",
                },
                {
                    title: "9. ليست خدمة طوارئ",
                    content: "قانونك ليست خدمة طوارئ. إذا كان لديك مسألة قانونية عاجلة:\n\n• اتصل بمحامٍ فوراً\n• اطلب المساعدة القانونية الطارئة من خلال القنوات المناسبة\n• لا تعتمد على الذكاء الاصطناعي لدينا للمسائل الحساسة للوقت\n• اتصل بالسلطات ذات الصلة إذا كنت في خطر مباشر",
                },
                {
                    title: "10. مسؤولية المستخدم",
                    content: "باستخدام قانونك، فإنك تقر بأنك:\n\n• تفهم أن هذه ليست مشورة قانونية\n• ستطلب المشورة القانونية المهنية لاحتياجاتك المحددة\n• أنت مسؤول عن التحقق من جميع المعلومات\n• تقبل المسؤولية الكاملة عن قراراتك القانونية\n• لن تعتمد فقط على المعلومات الناتجة عن الذكاء الاصطناعي للمسائل القانونية",
                },
                {
                    title: "11. التغييرات على إخلاء المسؤولية",
                    content: "نحتفظ بالحق في تعديل هذا الإخلاء في أي وقت. الاستمرار في استخدام خدمتنا بعد التغييرات يشكل قبولاً لإخلاء المسؤولية المعدل.",
                },
                {
                    title: "12. الاتصال للمسائل القانونية",
                    content: "لا يتنازل هذا الإخلاء عن أي حقوق أو دفوع. للأسئلة القانونية الخاصة بوضعك، استشر محامياً مرخصاً.\n\nللأسئلة حول هذا الإخلاء:\nالبريد الإلكتروني: legal@qanunak.com",
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

                {/* Warning Alert */}
                <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    <AlertDescription className="text-amber-900 dark:text-amber-200">
                        <strong className="font-semibold">{t.warning}:</strong> {t.warningText}
                    </AlertDescription>
                </Alert>

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
