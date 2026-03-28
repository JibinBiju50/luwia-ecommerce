-- ================================================
-- Luwia Skin Science — Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ================================================

-- ==================
-- ORDERS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'online',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================
-- REVIEWS TABLE
-- ==================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================
-- SUBSCRIBERS TABLE (stub for future use)
-- ==================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================
-- ROW LEVEL SECURITY
-- ==================

-- Reviews: publicly readable and insertable (no auth required)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (true);
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Orders: server-side only (via service role key)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are server-only"
  ON orders FOR ALL
  USING (false);

-- Subscribers: server-side only
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscribers are server-only"
  ON subscribers FOR ALL
  USING (false);
