const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 12499 → "₹12,499" */
export const formatPrice = (value: number) => inr.format(value);

/** 18999 → 12499 → 34 (percent off, rounded down) */
export const discountPercent = (mrp: number, price: number) =>
  mrp > price ? Math.floor(((mrp - price) / mrp) * 100) : 0;
