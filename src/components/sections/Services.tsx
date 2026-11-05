import React from "react";
import { servicesData } from "../../data/services";
import { SectionHeading } from "../ui/SectionHeading";
import { ServiceCard } from "../ui/ServiceCard";

export const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="w-full bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="OUR SERVICES"
          title="Book trusted house help."
          description="From hourly bookings to express cleans to daily upkeep, Pronto's got you covered. 20 services, transparent flat pricing."
          align="left"
        />

        {/* 6 columns desktop grid: 20 cards, last row 2 cards left-aligned */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
