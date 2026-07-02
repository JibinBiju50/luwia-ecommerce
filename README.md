# Luwia Skin Science - E-commerce Platform

A full-stack e-commerce platform built for a premium skincare brand. Designed with a focus on modern web standards, secure transactions, and a seamless user experience.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend & Database:** Supabase (PostgreSQL, Auth)
- **Payments:** Razorpay API (with Cash on Delivery support)
- **Security:** Upstash Redis (Edge Rate Limiting)
- **Infrastructure & APIs:** Resend (Transactional Emails), Vercel

## ✨ Key Features (Highlights for Recruiters)

- **Modern Next.js Architecture:** Built from scratch using the Next.js App Router and Server Components to ensure blazing-fast page loads, high SEO scores, and efficient state management for the shopping cart.
- **Passwordless Auth & Social Login:** Implemented a frictionless login experience using Supabase. Supports secure **Google OAuth** and email **Magic Links** with robust server-side session cookies.
- **Secure Checkout & Payments:** Integrated **Razorpay** for end-to-end encrypted digital payments, backed by custom backend API routes to cryptographically verify transactions and securely process orders.
- **Edge-Based API Security:** Protected critical backend routes (checkout and email triggers) against bot abuse and spam using **Upstash Redis rate limiting** (e.g., blocking excessive IPs).
- **Engaging UI & Automation:** Designed a highly responsive, mobile-first interface with Tailwind CSS featuring micro-animations. Automated transactional workflows (like order confirmations) using the **Resend API**.

## 🛠️ Getting Started (Local Development)

1. Install the project dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables. Create a `.env` file in the root directory (refer to `.env.example` if available) and add your keys for Supabase, Razorpay, Resend, and Upstash.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
