-- Admin Panel Database Schema
-- Run this in Supabase SQL Editor

-- 1. Add is_admin flag to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for fast admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- 2. Document Templates Table
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for document_templates
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- Public can view active templates
CREATE POLICY "Anyone can view active templates" ON document_templates
  FOR SELECT USING (is_active = true);

-- Admins can manage all templates
CREATE POLICY "Admins can manage templates" ON document_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 3. Lawyers Table
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  years_experience INTEGER,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0.0
);

-- Enable RLS for lawyers
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Public can view active lawyers
CREATE POLICY "Anyone can view active lawyers" ON lawyers
  FOR SELECT USING (is_active = true);

-- Admins can manage lawyers
CREATE POLICY "Admins can manage lawyers" ON lawyers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  service_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can view active reviews
CREATE POLICY "Anyone can view active reviews" ON reviews
  FOR SELECT USING (is_active = true);

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 5. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public can view active FAQs
CREATE POLICY "Anyone can view active faqs" ON faqs
  FOR SELECT USING (is_active = true);

-- Admins can manage FAQs
CREATE POLICY "Admins can manage faqs" ON faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 6. Create Storage Bucket for Templates (run separately in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('templates', 'templates', true)
-- ON CONFLICT (id) DO NOTHING;

-- 7. Create Storage Bucket for Lawyer Avatars
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true)
-- ON CONFLICT (id) DO NOTHING;
