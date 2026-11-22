import { Minus, Plus } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { useLandingStore } from '../store/useLandingStore';
import { Container } from '../components/common/Container';
import { SectionEyebrow } from '../components/common/SectionEyebrow';

export function FAQSection() {
  const { faq } = siteConfig;
  const openFaqId = useLandingStore((s) => s.openFaqId);
  const toggleFaqId = useLandingStore((s) => s.toggleFaqId);
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="faq"
      ref={ref}
      className={`bg-[#FAFAFA] border-t border-[#EDEDED] py-20 sm:py-24 reveal-section ${
        visible ? 'is-visible' : ''
      }`}
    >
      <Container>
        <div className="text-center">
          <SectionEyebrow>{faq.eyebrow}</SectionEyebrow>
          <h2 className="mt-2.5 font-display font-bold text-[34px] sm:text-[42px] leading-[1.1] tracking-[-0.025em] text-[#051315]">
            {faq.headingLead}
            <span className="italic text-[#D11F68]">{faq.headingAccent}</span>
          </h2>
        </div>

        <div className="mt-12 max-w-[660px] mx-auto divide-y divide-[#E8E8E8] border-y border-[#E8E8E8]">
          {faq.items.map((item) => {
            const isOpen = openFaqId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-trigger-${item.id}`;

            return (
              <div key={item.id} className="py-1">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFaqId(item.id)}
                  className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D11F68] rounded-md"
                >
                  <span className="font-display font-semibold text-[15px] sm:text-[16px] text-[#051315] group-hover:text-[#D11F68] transition-colors">
                    {item.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'text-[#D11F68]'
                        : 'text-[#646A6B] group-hover:text-[#051315]'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  data-open={isOpen}
                  className="accordion-panel"
                >
                  <div className="accordion-inner">
                    <p className="pb-5 pr-8 text-[13.5px] leading-[1.68] text-[#646A6B]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
