"use client";

import { Mail, MapPin } from "lucide-react";
import { FormEvent } from "react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const WHATSAPP_NUMBER = "917025459137"; 

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    if (!name || !message) {
      alert("Please enter both your name and message.");
      return;
    }

    const encodedMessage = encodeURIComponent(`Hi Luwia! My name is ${name}.\n\n${message}`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand-primary tracking-widest uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Have a question, feedback, or need help with your order? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Form (UI Only) */}
        <div className="bg-brand-bg/30 rounded-2xl p-6 md:p-8 border border-brand-primary/5">
          <h2 className="text-lg font-semibold text-brand-text mb-5">
            Send us a Message
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-brand-bg/50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 mb-4">
              <Mail className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-sm font-semibold text-brand-text mb-1">Email</h3>
            <a
              href="mailto:luwiaskinscience@gmail.com"
              className="text-sm text-brand-primary hover:underline break-all"
            >
              luwiaskinscience@gmail.com
            </a>
          </div>

          <div className="text-center p-6 bg-brand-bg/50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 mb-4">
              <MapPin className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-sm font-semibold text-brand-text mb-1">Address</h3>
            <p className="text-sm text-gray-500">
              Luwia Products
              <br />
              Kottayam, Kerala, India
            </p>
          </div>

          <div className="text-center p-6 bg-brand-bg/50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 mb-4">
              <InstagramIcon className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-sm font-semibold text-brand-text mb-1">Instagram</h3>
            <a
              href="https://www.instagram.com/luwiaskinscience"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-primary hover:underline"
            >
              @luwiaskinscience
            </a>
          </div>
        </div>

        
      </div>
    </div>
  );
}
