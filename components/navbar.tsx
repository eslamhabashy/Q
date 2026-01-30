"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scale, Menu, X, Globe, User, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "next-themes";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const onLanguageChange = (lang: "en" | "ar") => setLanguage(lang);
  const onThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark");
  const isDark = theme === "dark";

  const navItems = {
    en: {
      features: "Features",
      pricing: "Pricing",
      templates: "Templates",
      lawyers: "Find a Lawyer",
      login: "Log In",
      getStarted: "Get Started",
    },
    ar: {
      features: "المميزات",
      pricing: "الأسعار",
      templates: "النماذج",
      lawyers: "ابحث عن محامي",
      login: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
    },
  };

  const t = navItems[language];
  const isRTL = language === "ar";

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src={language === "ar" ? "/logos/logo-ar.png" : "/logos/logo-en.png"}
              alt={language === "ar" ? "قانونك" : "Qanunak"}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.features}
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.pricing}
            </Link>
            <Link
              href="/templates"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.templates}
            </Link>
            <Link
              href="/lawyers"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.lawyers}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLanguageChange(language === "en" ? "ar" : "en")}
              className="hidden sm:flex"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Toggle language</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="hidden sm:flex"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu (Desktop) */}
            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">{language === "ar" ? "لوحة التحكم" : "Dashboard"}</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">{t.login}</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                  >
                    <Link href="/signup">{t.getStarted}</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border pb-4 md:hidden">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="#features"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.features}
              </Link>
              <Link
                href="#pricing"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.pricing}
              </Link>
              <Link
                href="/templates"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.templates}
              </Link>
              <Link
                href="/lawyers"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.lawyers}
              </Link>
              <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onLanguageChange(language === "en" ? "ar" : "en")
                  }
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onThemeToggle}>
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">{language === "ar" ? "لوحة التحكم" : "Dashboard"}</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => signOut()}>
                      {language === "ar" ? "تسجيل الخروج" : "Log out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">{t.login}</Link>
                    </Button>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <Link href="/signup">{t.getStarted}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
