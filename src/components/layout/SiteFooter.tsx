import { footerColumns } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/router";
import { Wordmark } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-low">
      <div className="page-container grid gap-10 py-12 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-xs type-body-sm text-ink-secondary">
            The creative-services marketplace for India. Find artists, post gigs, agree terms and manage bookings in one place.
          </p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h2 className="type-label text-ink">{col.title}</h2>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="type-body-sm text-ink-secondary hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="page-container flex flex-col gap-2 py-5 type-caption text-ink-secondary sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalEntityName}. Made in India.
          </p>
          <p>Policies are drafts pending legal review.</p>
        </div>
      </div>
    </footer>
  );
}
