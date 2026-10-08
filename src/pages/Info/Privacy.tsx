import { BUSINESS } from "@/config/business";
import { InfoPage, Section } from "./InfoPage";

export default function Privacy() {
  return (
    <InfoPage
      title="Privacy & Policies"
      intro="What we collect when you shop with us, and what we do with it."
    >
      <Section heading="What we collect">
        <p>
          Your mobile number when you sign in, and your name, email and delivery
          addresses when you add them. We keep a record of your orders, your bag
          and your wishlist. If you pick a location on the map while adding an
          address, we store those coordinates with the address so deliveries
          reach you.
        </p>
      </Section>

      <Section heading="How we use it">
        <p>
          To take and deliver your orders, to send order updates by email and
          WhatsApp, and to answer you when you contact support. We don't sell
          your personal information.
        </p>
      </Section>

      <Section heading="Who else sees it">
        <p>
          Only the services needed to run the shop: Razorpay for payments,
          Fast2SMS for OTP and WhatsApp messages, Google Maps for address
          lookup, and our delivery partners for shipping. Each receives only
          what that job needs. Card and UPI details go straight to Razorpay —
          they never reach our servers.
        </p>
      </Section>

      <Section heading="Cookies and analytics">
        <p>
          We use Google Analytics to understand how the site is used — which
          pages people visit and how they move through the shop. It sets cookies
          and records your approximate location and device type. We see this as
          aggregate traffic, not as a record of you by name. Your browser's
          settings, or any content blocker, can refuse it; the shop works
          exactly the same either way.
        </p>
      </Section>

      <Section heading="Payment information">
        <p>
          We store the payment method and status of an order, never your card
          number, UPI PIN or bank credentials.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <p>
          Order records are kept as long as we're required to for tax and
          accounting. You can ask us to delete your account and personal details
          at any time, except what we must retain by law.
        </p>
      </Section>

      <Section heading="Your choices">
        <p>
          Write to us to see, correct or delete the information we hold about
          you. Location access is always optional — the address form works
          without it, and you can refuse it in your browser.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          {BUSINESS.name}, {BUSINESS.addressLines.join(", ")}. Privacy
          questions:{" "}
          <a
            href={`mailto:${BUSINESS.email}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.email}
          </a>{" "}
          or{" "}
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      </Section>
    </InfoPage>
  );
}
