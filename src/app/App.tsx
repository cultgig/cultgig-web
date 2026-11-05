import React from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { PressStrip } from "../components/sections/PressStrip";
import { WhyUs } from "../components/sections/WhyUs";
import { Services } from "../components/sections/Services";
import { HowItWorks } from "../components/sections/HowItWorks";
import { Testimonials } from "../components/sections/Testimonials";
import { Faq } from "../components/sections/Faq";
import { ClosingCta } from "../components/sections/ClosingCta";

export function Link({
  to,
  children,
  ...props
}: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-ink font-sans selection:bg-mint-200 selection:text-green-700">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-green-600 text-white px-4 py-2 rounded-md font-medium shadow-md outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* 1. Header */}
      <Header />

      {/* Main Landing Page Content */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero */}
        <Hero />

        {/* 3. Featured In Press Strip */}
        <PressStrip />

        {/* 4. Why Us (Trust Statistics) */}
        <WhyUs />

        {/* 5. Our Services (20 Service Cards) */}
        <Services />

        {/* 6. How It Works (Dark Background + 3 Step Phone Frames) */}
        <HowItWorks />

        {/* 7. Testimonials (Infinite Marquee) */}
        <Testimonials />

        {/* 8. Frequently Asked Questions (21 Accordion Rows) */}
        <Faq />

        {/* 9. Closing CTA (Mint Panel with Fanned Phones) */}
        <ClosingCta />
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
