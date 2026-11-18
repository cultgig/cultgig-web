import { ArrowUpRight } from "lucide-react";
import { footerColumns } from "../../config/navigation";
import { siteConfig } from "../../config/site";
import { Link } from "../../lib/router";

export function Footer() {
  const socials = [
    { label: "Instagram", href: siteConfig.socialLinks.instagram },
    { label: "LinkedIn", href: siteConfig.socialLinks.linkedin },
    { label: "YouTube", href: siteConfig.socialLinks.youtube },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="bg-surface border-t border-line text-ink-primary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Multi-column Marketplace Directory */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-line">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="type-h4 text-ink-primary mb-4">{column.title}</h2>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.path + link.label}>
                    <Link
                      to={link.path}
                      className="type-body-sm text-ink-secondary hover:text-plum inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Identity & Compliance Strip */}
        <div className="pt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link
                to="/"
                className="text-[20px] leading-[26px] font-bold tracking-[-0.02em] text-plum"
              >
                cultgig<span className="text-ochre">.</span>
              </Link>
              <span className="type-body-sm text-ink-secondary">
                {siteConfig.legalEntityName} · {siteConfig.country}
              </span>
            </div>
            <p className="type-caption text-ink-muted">
              {siteConfig.registeredAddress}
              {siteConfig.supportEmail
                ? ` · Support: ${siteConfig.supportEmail}`
                : " · Support email pending configuration"}
              {siteConfig.gstin ? ` · GSTIN: ${siteConfig.gstin}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="type-caption text-ink-muted">INR (₹) · India</span>
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Cultgig on ${label}`}
                    className="inline-flex items-center gap-1 min-h-[36px] px-3 rounded-md border border-line type-caption font-medium text-ink-secondary hover:text-plum hover:border-plum"
                  >
                    <span>{label}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
