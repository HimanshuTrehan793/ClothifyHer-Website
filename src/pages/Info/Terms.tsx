import { BUSINESS } from "@/config/business";
import { InfoPage, Section } from "./InfoPage";

export default function Terms() {
  return (
    <InfoPage
      title="Terms of Service"
      intro="These terms apply when you shop with ClothifyHer."
    >
      <Section heading="Orders">
        <p>
          An order is confirmed once we accept it. We may decline or cancel an
          order if an item is out of stock, if the price or description was
          listed incorrectly, or if we can't verify the delivery details. If
          you've already paid for an order we cancel, we refund it in full.
        </p>
      </Section>

      <Section heading="Prices and payment">
        <p>
          Prices are in Indian rupees and include applicable taxes. Delivery
          charges, discounts and the amount payable are shown in your bag before
          you pay. Online payments are handled by Razorpay; we don't store your
          card or UPI details.
        </p>
      </Section>

      <Section heading="Delivery">
        <p>
          We deliver to the address you provide at checkout. Please check it
          carefully — we can't redirect a parcel once it's been dispatched.
          Delivery timelines are estimates, not guarantees.
        </p>
      </Section>

      <Section heading="Returns">
        <p>
          You can request a return within 7 days of delivery. Items should be
          unworn and unwashed, with tags intact. Contact us with your order
          number to start a return. Refunds are issued to the original payment
          method once the returned item reaches us.
        </p>
      </Section>

      <Section heading="Your account">
        <p>
          You're responsible for the activity on your account and for keeping
          access to your registered mobile number secure. Tell us promptly if
          you think someone else is using your account.
        </p>
      </Section>

      <Section heading="Product images">
        <p>
          We photograph our products as accurately as we can. Colours can still
          vary slightly between screens, and handwork means small variations
          between pieces — that's normal, not a defect.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          {BUSINESS.name}, {BUSINESS.addressLines.join(", ")}. GSTIN{" "}
          {BUSINESS.gstin}. Questions about these terms:{" "}
          <a
            href={`mailto:${BUSINESS.email}`}
            className="text-maroon-700 underline underline-offset-2"
          >
            {BUSINESS.email}
          </a>
          .
        </p>
      </Section>
    </InfoPage>
  );
}
