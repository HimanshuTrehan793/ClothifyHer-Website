import type { Testimonial } from "@/interfaces/catalog";

/**
 * Editorial copy, not catalog data — the backend has no reviews table, so
 * there is nothing to fetch these from. They live here (rather than in the
 * mock catalog) to make the distinction explicit: everything else on the home
 * page comes from the API, and these are marketing copy maintained by hand.
 * Replace or clear them from this file until a reviews endpoint exists.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya R.",
    location: "Bengaluru",
    rating: 5,
    quote:
      "The cotton is genuinely soft, not the stiff kind that softens after ten washes. Wore the kurta straight out of the packet.",
    product: "Hand Block Printed Kurta",
  },
  {
    id: "t2",
    name: "Meera S.",
    location: "Pune",
    rating: 5,
    quote:
      "Sizing chart was accurate, which almost never happens for me. The co-ord fits like it was measured for me.",
    product: "Ivory Co-ord Set",
  },
  {
    id: "t3",
    name: "Fatima K.",
    location: "Hyderabad",
    rating: 4,
    quote:
      "Lovely drape and the colour is exactly as photographed. Took a day longer than the estimate to arrive.",
    product: "Floral Midi Dress",
  },
];
