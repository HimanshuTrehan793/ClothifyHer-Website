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

const dateOnly = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateWithTime = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * ISO timestamp → "12 Aug 2026". The API returns ISO strings everywhere, so
 * anything rendering a date goes through here. An unparseable value is passed
 * through untouched rather than rendered as "Invalid Date".
 */
export const formatDate = (iso?: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateOnly.format(date);
};

/** ISO timestamp → "12 Aug 2026, 4:30 pm" — used on order timelines. */
export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateWithTime.format(date);
};
