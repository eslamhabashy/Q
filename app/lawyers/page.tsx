"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Scale,
  Search,
  Star,
  MapPin,
  Briefcase,
  BadgeCheck,
  ArrowLeft,
  Globe,
  Moon,
  Sun,
  Crown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  experience_years: number;
  bio: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_active: boolean;
}

const specialties = [
  { id: "all", labelEn: "All Specialties", labelAr: "جميع التخصصات" },
  { id: "civil", labelEn: "Civil & Commercial", labelAr: "مدني وتجاري" },
  { id: "family", labelEn: "Family Law", labelAr: "قانون الأسرة" },
  { id: "labor", labelEn: "Labor & Employment", labelAr: "العمل والتوظيف" },
  { id: "real-estate", labelEn: "Real Estate", labelAr: "العقارات" },
  { id: "criminal", labelEn: "Criminal", labelAr: "جنائي" },
  { id: "corporate", labelEn: "Corporate & Business", labelAr: "الشركات والأعمال" },
];

const locations = [
  { id: "all", labelEn: "All Locations", labelAr: "جميع المواقع" },
  { id: "cairo", labelEn: "Cairo", labelAr: "القاهرة" },
  { id: "alexandria", labelEn: "Alexandria", labelAr: "الإسكندرية" },
  { id: "giza", labelEn: "Giza", labelAr: "الجيزة" },
  { id: "mansoura", labelEn: "Mansoura", labelAr: "المنصورة" },
];

export default function LawyersPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";
  const isDark = theme === "dark";
  const supabase = createClient();

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from("lawyers")
        .select("*")
        .eq("is_active", true)
        .order("is_verified", { ascending: false })
        .order("experience_years", { ascending: false });

      if (error) throw error;
      setLawyers(data || []);
    } catch (error: any) {
      console.error("Error fetching lawyers:", error);
      toast.error("Failed to load lawyers");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const content = {
    en: {
      title: "Find a Lawyer",
      subtitle:
        "Connect with verified lawyers specializing in Egyptian law. Book consultations and get professional legal representation.",
      search: "Search by name...",
      specialty: "Specialty",
      location: "Location",
      yearsExp: "years experience",
      verified: "Verified by Qanunak",
      available: "Available",
      requestConsultation: "Request Consultation",
      back: "Back to Home",
      premiumFeature: "Premium Feature",
      requestTitle: "Request Consultation",
      requestDescription: "Fill in the details below to request a consultation with",
      yourName: "Your Name",
      email: "Email Address",
      phone: "Phone Number",
      caseDescription: "Brief Description of Your Case",
      preferredTime: "Preferred Time",
      submit: "Submit Request",
      loading: "Loading lawyers...",
      noLawyers: "No lawyers found",
    },
    ar: {
      title: "ابحث عن محامي",
      subtitle:
        "تواصل مع محامين موثقين متخصصين في القانون المصري. احجز استشارات واحصل على تمثيل قانوني احترافي.",
      search: "البحث بالاسم...",
      specialty: "التخصص",
      location: "الموقع",
      yearsExp: "سنوات خبرة",
      verified: "موثق من قانونك",
      available: "متاح",
      requestConsultation: "طلب استشارة",
      back: "العودة للرئيسية",
      premiumFeature: "ميزة مميزة",
      requestTitle: "طلب استشارة",
      requestDescription: "املأ التفاصيل أدناه لطلب استشارة مع",
      yourName: "اسمك",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      caseDescription: "وصف موجز لقضيتك",
      preferredTime: "الوقت المفضل",
      submit: "إرسال الطلب",
      loading: "جاري تحميل المحامين...",
      noLawyers: "لم يتم العثور على محامين",
    },
  };

  const t = content[language];

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      lawyer.specialty.toLowerCase().includes(selectedSpecialty);
    const matchesLocation =
      selectedLocation === "all" ||
      lawyer.location.toLowerCase().includes(selectedLocation);
    return matchesSearch && matchesSpecialty && matchesLocation;
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
                <ArrowLeft
                  className={cn("h-4 w-4", isRTL && "rotate-180", isRTL ? "ml-2" : "mr-2")}
                />
                {t.back}
              </Link>
            </Button>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <img
              src={language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png"}
              alt={language === "ar" ? "قانونك" : "Qanunak"}
              className="h-16 w-auto"
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
          <Badge className="mb-4 bg-accent/20 text-accent">
            <Crown className="mr-1 h-3 w-3" />
            {t.premiumFeature}
          </Badge>
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
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          {/* Specialty Filter */}
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t.specialty} />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {language === "ar" ? specialty.labelAr : specialty.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t.location} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {language === "ar" ? location.labelAr : location.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lawyers Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredLawyers.map((lawyer) => (
            <Card key={lawyer.id} className="border-border transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16 shrink-0">
                    {lawyer.avatar_url && (
                      <AvatarImage src={lawyer.avatar_url} alt={lawyer.name} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-card-foreground">
                            {lawyer.name}
                          </h3>
                          {lawyer.is_verified && (
                            <BadgeCheck className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-accent">
                          {lawyer.specialty}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {t.available}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {lawyer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {lawyer.experience_years} {t.yearsExp}
                      </span>
                    </div>

                    {/* Bio */}
                    {lawyer.bio && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {lawyer.bio}
                      </p>
                    )}

                    {/* Action */}
                    <div className="mt-4 flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => setSelectedLawyer(lawyer)}
                          >
                            {t.requestConsultation}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{t.requestTitle}</DialogTitle>
                            <DialogDescription>
                              {t.requestDescription} {lawyer.name}
                            </DialogDescription>
                          </DialogHeader>
                          <form className="mt-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">{t.yourName}</Label>
                              <Input id="name" placeholder={t.yourName} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">{t.email}</Label>
                              <Input id="email" type="email" placeholder={t.email} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">{t.phone}</Label>
                              <Input id="phone" placeholder="+20" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="case">{t.caseDescription}</Label>
                              <Textarea
                                id="case"
                                placeholder={t.caseDescription}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">{t.preferredTime}</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={t.preferredTime} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="morning">
                                    {language === "ar" ? "صباحاً (9-12)" : "Morning (9-12)"}
                                  </SelectItem>
                                  <SelectItem value="afternoon">
                                    {language === "ar" ? "ظهراً (12-3)" : "Afternoon (12-3)"}
                                  </SelectItem>
                                  <SelectItem value="evening">
                                    {language === "ar" ? "مساءً (3-6)" : "Evening (3-6)"}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              {t.submit}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Verified Badge */}
                    {lawyer.is_verified && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-accent">
                        <BadgeCheck className="h-3 w-3" />
                        {t.verified}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredLawyers.length === 0 && (
          <div className="py-16 text-center">
            <Scale className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">{t.noLawyers}</p>
          </div>
        )}
      </main>
    </div>
  );
}
