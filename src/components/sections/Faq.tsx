import React, { useState } from "react";
import { faqsData } from "../../data/faqs";
import { SectionHeading } from "../ui/SectionHeading";
import { AccordionItem } from "../ui/AccordionItem";

export const Faq: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="FAQ'S"
          eyebrowVariant="green"
          title="Frequently Asked Questions"
          align="center"
          className="mb-10 sm:mb-14"
        />

        {/* 21 Accordion Rows in a constrained 760px column */}
        <div className="max-w-[760px] mx-auto flex flex-col gap-3">
          {faqsData.map((faq) => (
            <AccordionItem
              key={faq.id}
              item={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggleItem(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
