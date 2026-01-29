"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Scale,
  FileText,
  Briefcase,
  Home,
  Users,
  Building2,
  Search,
  Download,
  Eye,
  ArrowLeft,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

interface Template {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  downloads: number;
  premium: boolean;
}

const templates: Template[] = [
  {
    id: "1",
    titleEn: "Residential Rental Agreement",
    titleAr: "عقد إيجار سكني",
    descriptionEn:
      "Standard residential lease agreement compliant with Egyptian rent law. Includes terms for rent, duration, maintenance, and termination.",
    descriptionAr:
      "عقد إيجار سكني قياسي متوافق مع قانون الإيجار المصري. يتضمن شروط الإيجار والمدة والصيانة والإنهاء.",
    category: "rental",
    downloads: 2450,
    premium: false,
  },
  {
    id: "2",
    titleEn: "Commercial Lease Agreement",
    titleAr: "عقد إيجار تجاري",
    descriptionEn:
      "Comprehensive commercial property lease for shops, offices, and business premises under Egyptian commercial law.",
    descriptionAr:
      "عقد إيجار شامل للعقارات التجارية للمحلات والمكاتب ومقرات الأعمال وفقاً للقانون التجاري المصري.",
    category: "rental",
    downloads: 1820,
    premium: false,
  },
  {
    id: "3",
    titleEn: "Employment Contract",
    titleAr: "عقد عمل",
    descriptionEn:
      "Standard employment agreement covering salary, working hours, benefits, and termination terms under Egyptian labor law.",
    descriptionAr:
      "عقد توظيف قياسي يغطي الراتب وساعات العمل والمزايا وشروط الإنهاء بموجب قانون العمل المصري.",
    category: "employment",
    downloads: 3200,
    premium: false,
  },
  {
    id: "4",
    titleEn: "Non-Disclosure Agreement (NDA)",
    titleAr: "اتفاقية عدم الإفصاح",
    descriptionEn:
      "Protect confidential business information with this legally binding NDA template for Egyptian businesses.",
    descriptionAr:
      "احمِ معلومات العمل السرية بنموذج اتفاقية عدم الإفصاح الملزم قانونياً للشركات المصرية.",
    category: "employment",
    downloads: 890,
    premium: true,
  },
  {
    id: "5",
    titleEn: "Business Partnership Agreement",
    titleAr: "عقد شراكة تجارية",
    descriptionEn:
      "Establish clear terms for business partnerships including profit sharing, responsibilities, and dispute resolution.",
    descriptionAr:
      "حدد شروطاً واضحة للشراكات التجارية بما في ذلك توزيع الأرباح والمسؤوليات وحل النزاعات.",
    category: "business",
    downloads: 1560,
    premium: false,
  },
  {
    id: "6",
    titleEn: "Company Formation Documents",
    titleAr: "مستندات تأسيس شركة",
    descriptionEn:
      "Complete set of documents needed to register a limited liability company (LLC) in Egypt.",
    descriptionAr:
      "مجموعة كاملة من المستندات اللازمة لتسجيل شركة ذات مسؤولية محدودة في مصر.",
    category: "business",
    downloads: 2100,
    premium: true,
  },
  {
    id: "7",
    titleEn: "Power of Attorney",
    titleAr: "توكيل رسمي",
    descriptionEn:
      "Legal authorization document allowing someone to act on your behalf in specified legal and financial matters.",
    descriptionAr:
      "مستند تفويض قانوني يسمح لشخص بالتصرف نيابة عنك في مسائل قانونية ومالية محددة.",
    category: "family",
    downloads: 1890,
    premium: false,
  },
  {
    id: "8",
    titleEn: "Marriage Contract Addendum",
    titleAr: "ملحق عقد الزواج",
    descriptionEn:
      "Additional terms and conditions that can be added to the standard Egyptian marriage contract.",
    descriptionAr:
      "شروط وأحكام إضافية يمكن إضافتها إلى عقد الزواج المصري القياسي.",
    category: "family",
    downloads: 750,
    premium: true,
  },
  {
    id: "9",
    titleEn: "Service Agreement",
    titleAr: "عقد خدمات",
    descriptionEn:
      "General service agreement template for freelancers and service providers in Egypt.",
    descriptionAr:
      "نموذج عقد خدمات عام للعاملين المستقلين ومقدمي الخدمات في مصر.",
    category: "business",
    downloads: 1340,
    premium: false,
  },
  {
    id: "10",
    titleEn: "Termination Letter",
    titleAr: "خطاب إنهاء الخدمة",
    descriptionEn:
      "Professional employment termination letter template compliant with Egyptian labor law notice requirements.",
    descriptionAr:
      "نموذج خطاب إنهاء الخدمة المهني متوافق مع متطلبات الإخطار في قانون العمل المصري.",
    category: "employment",
    downloads: 980,
    premium: false,
  },
];

const categories = [
  { id: "all", icon: FileText, labelEn: "All Templates", labelAr: "جميع النماذج" },
  { id: "rental", icon: Home, labelEn: "Rental", labelAr: "الإيجار" },
  { id: "employment", icon: Briefcase, labelEn: "Employment", labelAr: "التوظيف" },
  { id: "business", icon: Building2, labelEn: "Business", labelAr: "الأعمال" },
  { id: "family", icon: Users, labelEn: "Family Law", labelAr: "قانون الأسرة" },
];

export default function TemplatesPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const isRTL = language === "ar";
  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const content = {
    en: {
      title: "Document Templates",
      subtitle:
        "Ready-to-use legal document templates for common Egyptian legal matters. Download, customize, and use.",
      search: "Search templates...",
      downloads: "downloads",
      useTemplate: "Use Template",
      preview: "Preview",
      premium: "Premium",
      free: "Free",
      back: "Back to Home",
      previewTitle: "Template Preview",
      previewDescription: "This is a preview of the template. Customize it to fit your needs.",
      download: "Download Template",
      disclaimer: "This template is for informational purposes. Have it reviewed by a lawyer before signing.",
    },
    ar: {
      title: "نماذج المستندات",
      subtitle:
        "نماذج مستندات قانونية جاهزة للاستخدام للمسائل القانونية المصرية الشائعة. حمّل وخصص واستخدم.",
      search: "البحث في النماذج...",
      downloads: "تحميلات",
      useTemplate: "استخدم النموذج",
      preview: "معاينة",
      premium: "مميز",
      free: "مجاني",
      back: "العودة للرئيسية",
      previewTitle: "معاينة النموذج",
      previewDescription: "هذه معاينة للنموذج. خصصه ليناسب احتياجاتك.",
      download: "تحميل النموذج",
      disclaimer: "هذا النموذج لأغراض إعلامية. راجعه مع محامٍ قبل التوقيع.",
    },
  };

  const t = content[language];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.titleAr.includes(searchQuery) ||
      template.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.descriptionAr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {language === "ar" ? "قانونك" : "Qanunak"}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  selectedCategory === category.id &&
                  "bg-accent text-accent-foreground hover:bg-accent/90"
                )}
              >
                <category.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {language === "ar" ? category.labelAr : category.labelEn}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group border-border transition-shadow hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Badge
                    variant={template.premium ? "default" : "secondary"}
                    className={cn(
                      template.premium
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {template.premium ? t.premium : t.free}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg text-card-foreground">
                  {language === "ar" ? template.titleAr : template.titleEn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {language === "ar" ? template.descriptionAr : template.descriptionEn}
                </p>
                <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>
                    {template.downloads.toLocaleString()} {t.downloads}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <Eye className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
                        {t.preview}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {language === "ar" ? template.titleAr : template.titleEn}
                        </DialogTitle>
                        <DialogDescription>{t.previewDescription}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 rounded-lg border border-border bg-muted/50 p-6">
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">
                            {language === "ar" ? template.titleAr : template.titleEn}
                          </p>
                          <p>
                            {language === "ar"
                              ? template.descriptionAr
                              : template.descriptionEn}
                          </p>
                          <div className="rounded-md bg-card p-4">
                            <p className="text-xs italic">{t.disclaimer}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                          {t.download}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {t.useTemplate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              {language === "ar"
                ? "لم يتم العثور على نماذج"
                : "No templates found"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
