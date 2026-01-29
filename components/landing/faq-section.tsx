"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  language: "en" | "ar";
}

export function FAQSection({ language }: FAQSectionProps) {
  const isRTL = language === "ar";

  const content = {
    en: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      faqs: [
        {
          question: "Is this considered legal advice?",
          answer:
            "No. Qanunak provides legal information and educational content about Egyptian law. This is not legal advice and should not be treated as such. We always recommend consulting with a licensed attorney for your specific legal situation. Our AI assistant helps you understand general legal concepts and your basic rights under Egyptian law.",
        },
        {
          question: "How accurate is the legal information provided?",
          answer:
            "Our AI is trained on Egyptian legal codes, regulations, and established legal precedents. While we strive for accuracy, laws can change and individual circumstances vary. The information provided should be used as a starting point for understanding your situation, not as definitive legal guidance.",
        },
        {
          question: "Can Qanunak represent me in court?",
          answer:
            "No. Qanunak is an information service, not a law firm. We cannot represent you in legal proceedings. However, our Premium plan includes access to our network of verified lawyers who can provide professional representation if needed.",
        },
        {
          question: "Is my information kept confidential?",
          answer:
            "Yes. We take privacy seriously. Your conversations are encrypted and stored securely. We do not share your personal information or conversation history with third parties. You can delete your data at any time from your account settings.",
        },
        {
          question: "What types of legal matters does Qanunak cover?",
          answer:
            "Qanunak covers common legal matters under Egyptian law including: labor and employment law, rental and real estate disputes, family law (marriage, divorce, custody), business formation and contracts, traffic violations, consumer rights, and civil disputes.",
        },
        {
          question: "Can I use the document templates for official purposes?",
          answer:
            "Our templates are designed to help you draft common legal documents. While they follow Egyptian legal requirements, we recommend having any important document reviewed by a licensed attorney before signing, especially for significant matters like business partnerships or property transactions.",
        },
      ],
    },
    ar: {
      label: "الأسئلة الشائعة",
      title: "الأسئلة المتكررة",
      faqs: [
        {
          question: "هل يعتبر هذا استشارة قانونية؟",
          answer:
            "لا. يقدم قانونك معلومات قانونية ومحتوى تعليمي حول القانون المصري. هذه ليست استشارة قانونية ولا يجب التعامل معها على هذا الأساس. نوصي دائماً باستشارة محامٍ مرخص لوضعك القانوني المحدد. يساعدك مساعدنا الذكي على فهم المفاهيم القانونية العامة وحقوقك الأساسية بموجب القانون المصري.",
        },
        {
          question: "ما مدى دقة المعلومات القانونية المقدمة؟",
          answer:
            "تم تدريب ذكائنا الاصطناعي على القوانين واللوائح المصرية والسوابق القانونية المعتمدة. بينما نسعى للدقة، قد تتغير القوانين وتختلف الظروف الفردية. يجب استخدام المعلومات المقدمة كنقطة انطلاق لفهم وضعك، وليس كتوجيه قانوني نهائي.",
        },
        {
          question: "هل يمكن لقانونك تمثيلي في المحكمة؟",
          answer:
            "لا. قانونك هو خدمة معلومات، وليس مكتب محاماة. لا يمكننا تمثيلك في الإجراءات القانونية. ومع ذلك، تتضمن خطتنا المميزة الوصول إلى شبكتنا من المحامين الموثقين الذين يمكنهم تقديم التمثيل المهني إذا لزم الأمر.",
        },
        {
          question: "هل معلوماتي محفوظة بسرية؟",
          answer:
            "نعم. نحن نأخذ الخصوصية على محمل الجد. محادثاتك مشفرة ومخزنة بشكل آمن. لا نشارك معلوماتك الشخصية أو سجل محادثاتك مع أطراف ثالثة. يمكنك حذف بياناتك في أي وقت من إعدادات حسابك.",
        },
        {
          question: "ما أنواع المسائل القانونية التي يغطيها قانونك؟",
          answer:
            "يغطي قانونك المسائل القانونية الشائعة بموجب القانون المصري بما في ذلك: قانون العمل والتوظيف، نزاعات الإيجار والعقارات، قانون الأسرة (الزواج والطلاق والحضانة)، تأسيس الأعمال والعقود، مخالفات المرور، حقوق المستهلك، والنزاعات المدنية.",
        },
        {
          question: "هل يمكنني استخدام نماذج المستندات لأغراض رسمية؟",
          answer:
            "تم تصميم نماذجنا لمساعدتك في صياغة المستندات القانونية الشائعة. بينما تتبع المتطلبات القانونية المصرية، نوصي بمراجعة أي مستند مهم من قبل محامٍ مرخص قبل التوقيع، خاصة للمسائل الهامة مثل الشراكات التجارية أو المعاملات العقارية.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      id="faq"
      className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
            {t.label}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {t.faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
