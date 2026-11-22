import { ActionModal } from './components/common/ActionModal';
import { Footer } from './components/footer/Footer';
import { Header } from './components/navigation/Header';
import { CandidateBenefits } from './sections/CandidateBenefits';
import { CandidateSection } from './sections/CandidateSection';
import { CompanySection } from './sections/CompanySection';
import { FAQSection } from './sections/FAQSection';
import { FinalCTASection } from './sections/FinalCTASection';
import { HeroSection } from './sections/HeroSection';
import { LogoStripSection } from './sections/LogoStripSection';
import { ReachSection } from './sections/ReachSection';
import { TestimonialsSection } from './sections/TestimonialsSection';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#051315]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#051315] focus:text-white focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <HeroSection />
        <LogoStripSection />
        <CompanySection />
        <CandidateSection />
        <CandidateBenefits />
        <ReachSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
      <ActionModal />
    </div>
  );
}

export default App;
