import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { BackButton } from "@/components/bits/BackButton";
import { SiteFooter } from "@/components/common/SiteFooter";

/** Shared shell for the plain content pages (about, FAQ, terms, privacy). */
export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>{`${title} — ClothifyHer`}</title>
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />
        <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
        {intro && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500">{intro}</p>
        )}
        <div className="mt-8 space-y-8">{children}</div>
      </div>

      <SiteFooter />
    </>
  );
}

/** One titled block of copy. */
export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-stone-900">{heading}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-stone-600">
        {children}
      </div>
    </section>
  );
}
