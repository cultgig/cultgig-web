import React from "react";
import { brandConfig } from "../../config/brand";
import { footerColumns } from "../../data/footer";
import { servicesData } from "../../data/services";
import { citiesData } from "../../data/cities";

export const Footer: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-ink text-white pt-16 pb-12 overflow-hidden border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Row 1: Brand + 4 Nav Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <a href="#hero" aria-label="Pronto Home" className="inline-block">
              <img
                src={brandConfig.logo.white}
                alt={brandConfig.logo.alt}
                width="120"
                height="32"
                className="h-[28px] w-auto object-contain"
              />
            </a>
            <div className="mt-2 text-[13px] text-white/70 space-y-3 font-sans">
              <div>
                <p className="text-white/50 text-[12px] mb-0.5">Feel free to reach us at:</p>
                <a
                  href={`mailto:${brandConfig.emails.support}`}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {brandConfig.emails.support}
                </a>
              </div>
              <div>
                <p className="text-white/50 text-[12px] mb-0.5">Careers:</p>
                <a
                  href={`mailto:${brandConfig.emails.careers}`}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {brandConfig.emails.careers}
                </a>
              </div>
            </div>
          </div>

          {/* 4 Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60 font-sans">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2 font-sans text-[13px] text-white/85">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => !link.isExternal && handleLinkClick(e, link.href)}
                      className="hover:text-green-600 transition-colors inline-block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Row 2: All Services + All Cities Lists */}
        <div className="py-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Services Column */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60 font-sans mb-4">
              ALL SERVICES
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[12px] sm:text-[13px] text-white/70 font-sans">
              {servicesData.map((s) => (
                <a
                  key={s.id}
                  href="#services"
                  onClick={(e) => handleLinkClick(e, "#services")}
                  className="hover:text-green-600 transition-colors truncate"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Cities Column */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60 font-sans mb-4">
              ALL CITIES
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[12px] sm:text-[13px] text-white/70 font-sans">
              {citiesData.map((c) => (
                <a
                  key={c.id}
                  href="#hero"
                  onClick={(e) => handleLinkClick(e, "#hero")}
                  className="hover:text-green-600 transition-colors truncate"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Socials & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/50 font-sans">
          <div className="flex items-center gap-5">
            <a
              href={brandConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Pronto on Instagram"
              className="text-white/70 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href={brandConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Pronto on LinkedIn"
              className="text-white/70 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href={brandConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to Pronto on YouTube"
              className="text-white/70 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" />
              </svg>
            </a>
          </div>

          <p className="text-[12px] sm:text-[13px]">
            {brandConfig.name} &copy; {brandConfig.copyrightYear}
          </p>
        </div>
      </div>
    </footer>
  );
};
