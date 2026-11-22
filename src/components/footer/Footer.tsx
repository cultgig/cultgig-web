import { siteConfig } from '../../config/siteConfig';
import { useLandingStore } from '../../store/useLandingStore';
import { BrandWordmark } from '../common/BrandWordmark';
import { Container } from '../common/Container';

export function Footer() {
  const { footer, copyrightYear } = siteConfig;
  const openInfo = useLandingStore((s) => s.openInfo);
  const openJobs = useLandingStore((s) => s.openJobs);
  const openLead = useLandingStore((s) => s.openLead);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    infoKey?: string
  ) => {
    e.preventDefault();
    if (infoKey === 'contact') {
      openLead('contact');
      return;
    }
    if (infoKey === 'browse-jobs') {
      openJobs();
      return;
    }
    if (infoKey === 'remote-jobs') {
      openJobs('Remote');
      return;
    }
    if (infoKey === 'post-free') {
      openLead('hire');
      return;
    }
    if (infoKey) {
      openInfo(infoKey);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-obsidian text-ink-inverse border-t border-white/10">
      <Container className="py-14 sm:py-16">
        {/* Main Footer Grid: Brand + 4 Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2 pr-4">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Back to top of Cultgig"
              className="inline-flex items-center"
            >
              <BrandWordmark variant="light" />
            </a>
            <p className="mt-4 text-[12.5px] leading-[1.65] text-ink-inverse/65 max-w-[280px]">
              {footer.description}
            </p>

            {/* Social Media Links */}
            <div className="mt-5 flex items-center gap-3">
              {[
                { label: 'LinkedIn', short: 'in' },
                { label: 'X', short: '𝕏' },
                { label: 'Instagram', short: 'IG' },
                { label: 'YouTube', short: '▶' },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => openInfo('about')}
                  aria-label={`Cultgig on ${social.label}`}
                  className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] text-ink-inverse/75 hover:text-ink-inverse hover:border-white/35 text-[11px] font-semibold flex items-center justify-center transition-colors"
                >
                  {social.short}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="font-sans text-[10.5px] font-semibold tracking-[0.12em] uppercase text-ink-inverse/90">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href, link.infoKey)}
                      className="text-[12.5px] text-ink-inverse/65 hover:text-ink-inverse transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Horizontal Divider */}
        <hr className="my-12 border-white/10" />

        {/* SEO Browse Section */}
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-ink-inverse/75">
            {footer.seoBrowseHeading}
          </p>

          <div className="mt-6 space-y-4">
            {footer.seoBrowseGroups.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2.5 md:gap-4 items-start"
              >
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-inverse/60 pt-1.5">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.links.map((pillLabel) => (
                    <button
                      key={pillLabel}
                      type="button"
                      onClick={() =>
                        openJobs(
                          pillLabel.replace(/\s*Jobs?$/i, '').replace(/\s*▾$/, '').trim()
                        )
                      }
                      className="px-2.5 py-1 rounded-[6px] border border-white/15 bg-white/[0.03] text-[11px] text-ink-inverse/75 hover:text-ink-inverse hover:border-white/35 hover:bg-white/[0.06] transition-colors whitespace-nowrap"
                    >
                      {pillLabel}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11.5px] text-ink-inverse/60">
          <p>© {copyrightYear} Cultgig. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => openInfo('privacy')}
              className="hover:text-ink-inverse transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => openInfo('terms')}
              className="hover:text-ink-inverse transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
