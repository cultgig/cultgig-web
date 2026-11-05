import React, { useEffect, useState } from "react";
import { brandConfig } from "../../config/brand";
import { servicesData } from "../../data/services";
import { citiesData } from "../../data/cities";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full h-[64px] bg-white transition-all duration-200 ${
        isScrolled
          ? "border-b border-border shadow-sm bg-white/95 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
        {/* Brand wordmark logo */}
        <a
          href="#hero"
          onClick={(e) => handleSmoothScroll(e, "#hero")}
          className="flex items-center gap-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
          aria-label="Pronto Home"
        >
          <img
            src={brandConfig.logo.green}
            alt={brandConfig.logo.alt}
            width="120"
            height="32"
            className="h-[28px] sm:h-[30px] w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-ink"
        >
          <a
            href="#why-us"
            onClick={(e) => handleSmoothScroll(e, "#why-us")}
            className="py-1 hover:text-green-600 transition-colors whitespace-nowrap"
          >
            Why us
          </a>

          <NavDropdown
            label="Services"
            items={servicesData.map((s) => ({
              id: s.id,
              name: s.name,
              href: "#services",
            }))}
            viewAllText="View all services"
            viewAllHref="#services"
            columns={3}
            onItemClick={() => {
              const el = document.querySelector("#services");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          <NavDropdown
            label="Cities"
            items={citiesData.map((c) => ({
              id: c.id,
              name: c.name,
              href: "#hero",
            }))}
            viewAllText="View all cities"
            viewAllHref="#hero"
            columns={2}
          />

          <a
            href="#how-it-works"
            onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
            className="py-1 hover:text-green-600 transition-colors whitespace-nowrap"
          >
            How it works
          </a>

          <a
            href="#faqs"
            onClick={(e) => handleSmoothScroll(e, "#faqs")}
            className="py-1 hover:text-green-600 transition-colors whitespace-nowrap"
          >
            FAQs
          </a>
        </nav>

        {/* Mobile menu toggle button */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-ink hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};
