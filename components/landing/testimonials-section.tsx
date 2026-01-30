"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TestimonialsSectionProps {
  language: "en" | "ar";
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  service_type: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export function TestimonialsSection({ language }: TestimonialsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";
  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    en: {
      label: "Testimonials",
      title: "Trusted by thousands of Egyptians",
    },
    ar: {
      label: "آراء العملاء",
      title: "موثوق به من قبل آلاف المصريين",
    },
  };

  const t = content[language];

  if (loading) {
    return (
      <section className="bg-secondary px-4 py-20 sm:px-6 lg:px-8 lg:py-28" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Don't show section if no reviews
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-secondary px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent">
            {t.label}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
            {t.title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id} className="border-border bg-card">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {`"${review.review_text}"`}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.customer_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {review.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {review.service_type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
