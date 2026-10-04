import { BUSINESS } from "@/config/business";
import { InfoPage, Section } from "./InfoPage";

export default function About() {
  return (
    <InfoPage
      title="About Us"
      intro="Everyday womenswear built for style, comfort and confidence."
    >
      <Section heading="Who we are">
        <p>
          ClothifyHer is a women's clothing label based in Hyderabad. We make
          kurtas, dresses, co-ord sets, tops and bottom wear for everyday wear —
          pieces meant to be worn often, not saved for occasions.
        </p>
      </Section>

      <Section heading="Where to find us">
        <address className="not-italic">
          {BUSINESS.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="text-stone-500">GSTIN: {BUSINESS.gstin}</p>
      </Section>

      <Section heading="Get in touch">
        <p>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.email}
          </a>
        </p>
        <p>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </p>
      </Section>
    </InfoPage>
  );
}
