"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "ar"

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language
}

interface LanguageProviderState {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: (key) => key,
  dir: "ltr",
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language, mounted])

  const dir = language === "ar" ? "rtl" : "ltr"

  // Simple translation placeholder - in a real app this would use a dictionary
  const t = (key: string) => key

  const value = {
    language,
    setLanguage,
    t,
    dir,
  }

  if (!mounted) {
    return (
      <LanguageProviderContext.Provider value={value}>
        {/* Render children to avoid layout shift, but hydration mismatch might occur if we change dir differently than server. 
            For now, we rely on suppressHydrationWarning in layout. */}
        <div style={{ visibility: "hidden" }}>{children}</div>
      </LanguageProviderContext.Provider>
    )
  }

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}
