"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Clock,
  BadgeCheck,
  ArrowLeft,
  Globe,
  Moon,
  Sun,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

interface Lawyer {
  id: string;
  nameEn: string;
  nameAr: string;
  specialtyEn: string;
  specialtyAr: string;
  locationEn: string;
  locationAr: string;
  experience: number;
  rating: number;
  reviews: number;
  hourlyRate: number;
  verified: boolean;
  available: boolean;
}

const lawyers: Lawyer[] = [
  {
    id: "1",
    nameEn: "Dr. Hassan El-Masry",
    nameAr: "د. حسن المصري",
    specialtyEn: "Civil & Commercial Law",
    specialtyAr: "القانون المدني والتجاري",
    locationEn: "Cairo, Maadi",
    locationAr: "القاهرة، المعادي",
    experience: 25,
    rating: 4.9,
    reviews: 156,
    hourlyRate: 500,
    verified: true,
    available: true,
  },
  {
    id: "2",
    nameEn: "Fatima Abdel-Rahman",
    nameAr: "فاطمة عبد الرحمن",
    specialtyEn: "Family Law",
    specialtyAr: "قانون الأسرة",
    locationEn: "Cairo, Nasr City",
    locationAr: "القاهرة، مدينة نصر",
    experience: 15,
    rating: 4.8,
    reviews: 98,
    hourlyRate: 400,
    verified: true,
    available: true,
  },
  {
    id: "3",
    nameEn: "Mohamed Salah Eddine",
    nameAr: "محمد صلاح الدين",
    specialtyEn: "Labor & Employment Law",
    specialtyAr: "قانون العمل والتوظيف",
    locationEn: "Alexandria",
    locationAr: "الإسكندرية",
    experience: 18,
    rating: 4.7,
    reviews: 124,
    hourlyRate: 350,
    verified: true,
    available: false,
  },
  {
    id: "4",
    nameEn: "Nour Hassan",
    nameAr: "نور حسن",
    specialtyEn: "Real Estate Law",
    specialtyAr: "قانون العقارات",
    locationEn: "Giza, 6th October",
    locationAr: "الجيزة، السادس من أكتوبر",
    experience: 12,
    rating: 4.6,
    reviews: 87,
    hourlyRate: 300,
    verified: true,
    available: true,
  },
  {
    id: "5",
    nameEn: "Ahmed Kamal",
    nameAr: "أحمد كمال",
    specialtyEn: "Criminal Law",
    specialtyAr: "القانون الجنائي",
    locationEn: "Cairo, Downtown",
    locationAr: "القاهرة، وسط البلد",
    experience: 20,
    rating: 4.9,
    reviews: 203,
    hourlyRate: 600,
    verified: true,
    available: true,
  },
  {
    id: "6",
    nameEn: "Laila Ibrahim",
    nameAr: "ليلى إبراهيم",
    specialtyEn: "Corporate & Business Law",
    specialtyAr: "قانون الشركات والأعمال",
    locationEn: "Cairo, New Cairo",
    locationAr: "القاهرة، القاهرة الجديدة",
    experience: 14,
    rating: 4.8,
    reviews: 112,
    hourlyRate: 450,
    verified: true,
    available: true,
  },
  {
    id: "7",
    nameEn: "Omar Sherif",
    nameAr: "عمر شريف",
    specialtyEn: "Intellectual Property",
    specialtyAr: "الملكية الفكرية",
    locationEn: "Cairo, Heliopolis",
    locationAr: "القاهرة، مصر الجديدة",
    experience: 10,
    rating: 4.5,
    reviews: 64,
    hourlyRate: 400,
    verified: true,
    available: false,
  },
  {
    id: "8",
    nameEn: "Heba Mostafa",
    nameAr: "هبة مصطفى",
    specialtyEn: "Family Law",
    specialtyAr: "قانون الأسرة",
    locationEn: "Mansoura",
    locationAr: "المنصورة",
    experience: 8,
    rating: 4.7,
    reviews: 56,
    hourlyRate: 250,
    verified: true,
    available: true,
  },
];

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
  const isRTL = language === "ar";
  const isDark = theme === "dark";

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
      reviews: "reviews",
      perHour: "/hour",
      verified: "Verified by Qanunak",
      available: "Available",
      unavailable: "Unavailable",
      requestConsultation: "Request Consultation",
      back: "Back to Home",
      premiumFeature: "Premium Feature",
      premiumDescription:
        "Lawyer consultations are available for Premium subscribers. Upgrade to access verified lawyers.",
      upgrade: "Upgrade to Premium",
      requestTitle: "Request Consultation",
      requestDescription: "Fill in the details below to request a consultation with",
      yourName: "Your Name",
      email: "Email Address",
      phone: "Phone Number",
      caseDescription: "Brief Description of Your Case",
      preferredTime: "Preferred Time",
      submit: "Submit Request",
      currency: "EGP",
    },
    ar: {
      title: "ابحث عن محامي",
      subtitle:
        "تواصل مع محامين موثقين متخصصين في القانون المصري. احجز استشارات واحصل على تمثيل قانوني احترافي.",
      search: "البحث بالاسم...",
      specialty: "التخصص",
      location: "الموقع",
      yearsExp: "سنوات خبرة",
      reviews: "تقييمات",
      perHour: "/ساعة",
      verified: "موثق من قانونك",
      available: "متاح",
      unavailable: "غير متاح",
      requestConsultation: "طلب استشارة",
      back: "العودة للرئيسية",
      premiumFeature: "ميزة مميزة",
      premiumDescription:
        "استشارات المحامين متاحة للمشتركين المميزين. قم بالترقية للوصول إلى المحامين الموثقين.",
      upgrade: "الترقية للمميز",
      requestTitle: "طلب استشارة",
      requestDescription: "املأ التفاصيل أدناه لطلب استشارة مع",
      yourName: "اسمك",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      caseDescription: "وصف موجز لقضيتك",
      preferredTime: "الوقت المفضل",
      submit: "إرسال الطلب",
      currency: "ج.م",
    },
  };

  const t = content[language];

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.nameAr.includes(searchQuery);
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      lawyer.specialtyEn.toLowerCase().includes(selectedSpecialty);
    const matchesLocation =
      selectedLocation === "all" ||
      lawyer.locationEn.toLowerCase().includes(selectedLocation);
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

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
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {(language === "ar" ? lawyer.nameAr : lawyer.nameEn)
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
                            {language === "ar" ? lawyer.nameAr : lawyer.nameEn}
                          </h3>
                          {lawyer.verified && (
                            <BadgeCheck className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-accent">
                          {language === "ar" ? lawyer.specialtyAr : lawyer.specialtyEn}
                        </p>
                      </div>
                      <Badge
                        variant={lawyer.available ? "default" : "secondary"}
                        className={cn(
                          lawyer.available
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {lawyer.available ? t.available : t.unavailable}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {language === "ar" ? lawyer.locationAr : lawyer.locationEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {lawyer.experience} {t.yearsExp}
                      </span>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium text-card-foreground">
                          {lawyer.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({lawyer.reviews} {t.reviews})
                      </span>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-card-foreground">
                          {lawyer.hourlyRate} {t.currency}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t.perHour}
                        </span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            disabled={!lawyer.available}
                            onClick={() => setSelectedLawyer(lawyer)}
                          >
                            {t.requestConsultation}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{t.requestTitle}</DialogTitle>
                            <DialogDescription>
                              {t.requestDescription}{" "}
                              {language === "ar" ? lawyer.nameAr : lawyer.nameEn}
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
                    {lawyer.verified && (
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
            <p className="mt-4 text-muted-foreground">
              {language === "ar" ? "لم يتم العثور على محامين" : "No lawyers found"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
