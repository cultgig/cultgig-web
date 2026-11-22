import { Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { useScrolled } from '../../hooks/useScrolled';
import { useLandingStore } from '../../store/useLandingStore';
import { BrandWordmark } from '../common/BrandWordmark';
import { Container } from '../common/Container';

export function Header() {
  const scrolled = useScrolled(10);
  const mobileMenuOpen = useLandingStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useLandingStore((s) => s.setMobileMenuOpen);
  const toggleMobileMenu = useLandingStore((s) => s.toggleMobileMenu);
  const openAuth = useLandingStore((s) => s.openAuth);
  const openInfo = useLandingStore((s) => s.openInfo);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    action?: 'scroll' | 'modal-info',
    infoKey?: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (action === 'modal-info' && infoKey) {
      openInfo(infoKey);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-shadow duration-200 ${
        scrolled ? 'border-[#E6E6E6] shadow-[0_4px_20px_rgba(5,19,21,0.06)]' : 'border-[#EDEDED]'
      }`}
    >
      <Container>
        <div className="h-[62px] flex items-center justify-between gap-6">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Cultgig home"
            className="inline-flex items-center focus-visible:rounded-md"
          >
            <BrandWordmark variant="dark" />
          </a>

          {/* Zone 2: Center navigation links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.action, item.infoKey)}
                className="text-[13px] font-medium text-[#646A6B] hover:text-[#051315] transition-colors duration-200 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#051315]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Auth actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => openAuth('log-in', 'candidate')}
              className="text-[13px] font-medium text-[#051315] hover:text-[#D11F68] transition-colors duration-200 whitespace-nowrap shrink-0 px-2 py-1.5 rounded-md"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => openAuth('sign-up', 'candidate')}
              className="h-[34px] px-4 rounded-full bg-[#051315] text-white text-[12.5px] font-semibold hover:bg-[#1B1818] transition-colors duration-200 whitespace-nowrap shrink-0"
            >
              Sign up
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-[#051315] hover:bg-[#FAFAFA] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="md:hidden pb-5 pt-2 border-t border-[#EDEDED] space-y-2"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {siteConfig.navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.action, item.infoKey)}
                  className="py-3 text-[14px] font-medium text-[#051315] hover:text-[#D11F68] border-b border-[#F3F3F3]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openAuth('log-in', 'candidate')}
                className="flex-1 h-11 rounded-full border border-[#EDEDED] text-[13.5px] font-semibold text-[#051315] hover:bg-[#FAFAFA]"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth('sign-up', 'candidate')}
                className="flex-1 h-11 rounded-full bg-[#051315] text-white text-[13.5px] font-semibold hover:bg-[#1B1818]"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
