import { BUSINESS } from "@/config/business";
import { InfoPage, Section } from "./InfoPage";

export default function Faq() {
  return (
    <InfoPage
      title="FAQ"
      intro="Answers to the questions we're asked most. Anything else, just message us."
    >
      <Section heading="How do I place an order?">
        <p>
          Pick your size and colour on the product page, add it to your bag and
          check out. You'll need to sign in with your mobile number — your bag,
          addresses and orders are saved to that account.
        </p>
      </Section>

      <Section heading="How can I pay?">
        <p>
          Online payment through Razorpay (UPI, cards, netbanking and wallets).
          Cash on delivery is available when it's switched on for your order —
          you'll see the option at checkout.
        </p>
      </Section>

      <Section heading="What does delivery cost?">
        <p>
          A flat delivery fee applies, and orders above our free-delivery
          threshold ship free. The exact amounts are shown in your bag before
          you pay, so there's nothing added later.
        </p>
      </Section>

      <Section heading="Can I return something?">
        <p>
          Yes — we offer 7-day returns. Message us with your order number and
          we'll arrange it.
        </p>
      </Section>

      <Section heading="How do I track my order?">
        <p>
          Open <span className="font-medium">Orders</span> in your account. Each
          order shows its current stage, from confirmed through to delivered,
          and we message you on WhatsApp as it moves.
        </p>
      </Section>

      <Section heading="How do I reach you?">
        <p>
          Email{" "}
          <a
            href={`mailto:${BUSINESS.email}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.email}
          </a>{" "}
          or call{" "}
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.phoneDisplay}
          </a>
          . The WhatsApp button on any page reaches us too.
        </p>
      </Section>
    </InfoPage>
  );
}
