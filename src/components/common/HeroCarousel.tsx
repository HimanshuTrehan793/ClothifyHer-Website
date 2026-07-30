import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/interfaces/catalog";

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, go, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate overflow-hidden"
    >
      <div className="relative h-[78svh] min-h-[480px] w-full sm:h-[70svh] lg:h-[80svh]">
        {slides.map((slide, i) => (
          <article
            key={slide.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <img
              src={slide.image}
              alt=""
              /* The first slide is the LCP element — never lazy-load it. */
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="h-full w-full object-cover object-top"
            />
            <div className="img-scrim absolute inset-0" />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16 lg:px-10 lg:pb-24">
              <span className="bg-maroon-800 inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase">
                {slide.eyebrow}
              </span>

              <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
                {slide.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={slide.primaryCta.href}
                  className="bg-maroon-800 hover:bg-maroon-900 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.03]"
                >
                  {slide.primaryCta.label}
                </Link>
                {slide.secondaryCta && (
                  <Link
                    to={slide.secondaryCta.href}
                    className="text-maroon-900 rounded-full bg-stone-50/90 px-7 py-3.5 text-sm font-semibold shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:bg-stone-50"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
