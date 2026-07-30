import { SectionHeading } from "@/components/bits/SectionHeading";
import { OccasionCard } from "@/components/custom/card/OccasionCard";
import type { Occasion } from "@/interfaces/catalog";

export function OccasionGrid({ occasions }: { occasions: Occasion[] }) {
  return (
    <section id="occasions" className="py-12 sm:py-16">
      <SectionHeading
        title="Shop by Occasion"
        subtitle="Dressed for the moment, whatever it calls for"
        action={{ label: "All occasions", href: "/occasions" }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-10">
        {occasions.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </div>
    </section>
  );
}
