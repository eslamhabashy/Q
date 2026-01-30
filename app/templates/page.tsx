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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  download_count: number;
  file_url: string;
  file_name: string;
  is_active: boolean;
}

const categories = [
  { id: "all", icon: FileText, labelEn: "All Templates", labelAr: "جميع النماذج" },
  { id: "Rental", icon: Home, labelEn: "Rental", labelAr: "الإيجار" },
  { id: "Employment", icon: Briefcase, labelEn: "Employment", labelAr: "التوظيف" },
  { id: "Business", icon: Building2, labelEn: "Business", labelAr: "الأعمال" },
  { id: "Family", icon: Users, labelEn: "Family Law", labelAr: "قانون الأسرة" },
  { id: "Other", icon: FileText, labelEn: "Other", labelAr: "أخرى" },
];

export default function TemplatesPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";
  const isDark = theme === "dark";
  const supabase = createClient();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .eq("is_active", true)
        .order("download_count", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (template: Template) => {
    // Increment download count
    try {
      await supabase
        .from("document_templates")
        .update({ download_count: template.download_count + 1 })
        .eq("id", template.id);

      // Download file
      window.open(template.file_url, "_blank");
      toast.success(language === "ar" ? "جاري التحميل..." : "Downloading...");

      // Refresh templates to update count
      fetchTemplates();
    } catch (error) {
      toast.error(language === "ar" ? "فشل التحميل" : "Download failed");
    }
  };

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
      loading: "Loading templates...",
      noTemplates: "No templates found",
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
      loading: "جاري تحميل النماذج...",
      noTemplates: "لم يتم العثور على نماذج",
    },
  };

  const t = content[language];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              className="h-12 w-auto"
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
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {t.free}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg text-card-foreground">
                  {template.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>
                    {template.download_count.toLocaleString()} {t.downloads}
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
                          {template.title}
                        </DialogTitle>
                        <DialogDescription>{t.previewDescription}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 rounded-lg border border-border bg-muted/50 p-6">
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">
                            {template.title}
                          </p>
                          <p>{template.description}</p>
                          <div className="rounded-md bg-card p-4">
                            <p className="text-xs italic">{t.disclaimer}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => handleDownload(template)}
                        >
                          <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                          {t.download}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => handleDownload(template)}
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
            <p className="mt-4 text-muted-foreground">{t.noTemplates}</p>
          </div>
        )}
      </main>
    </div>
  );
}
