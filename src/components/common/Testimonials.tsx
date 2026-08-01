import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/bits/SectionHeading";
import type { Testimonial } from "@/interfaces/catalog";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="bg-maroon-800 text-cream-100 py-12 sm:py-16">
      <SectionHeading
        title="Loved by Her"
        subtitle="What our customers say after wearing it"
        tone="cream"
      />

      {/* Horizontal snap rail on mobile, plain grid from md up. */}
      <ul className="hide-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 md:grid md:grid-cols-3 md:overflow-visible lg:px-10">
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[82%] shrink-0 snap-start rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 md:w-auto"
          >
            <Quote className="text-gold-400 h-6 w-6" />

            <div
              className="mt-4 flex gap-0.5"
              aria-label={`${item.rating} out of 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  aria-hidden
                  className={
                    i < item.rating
                      ? "fill-gold-400 text-gold-400 h-4 w-4"
                      : "h-4 w-4 text-white/25"
                  }
                />
              ))}
            </div>

            <p className="text-cream-100/85 mt-3 text-[15px] leading-relaxed">
              {item.quote}
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-gold-300 text-xs">
                {item.location} · bought {item.product}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
