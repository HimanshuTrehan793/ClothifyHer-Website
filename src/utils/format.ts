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

/**
 * Any Indian number → "+91 91876 38836".
 *
 * Numbers arrive in two shapes: the auth slice keeps the national 10 digits,
 * while the API returns E.164 ("+919187638836"). Screens used to prepend
 * "+91" themselves, which printed it twice whenever the E.164 form showed up.
 * Everything goes through here instead.
 */
export const formatPhone = (value?: string | null): string => {
  const digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  // Keep the last 10: strips a country code without assuming one is present.
  const national = digits.length > 10 ? digits.slice(-10) : digits;
  return national.length === 10
    ? `+91 ${national.slice(0, 5)} ${national.slice(5)}`
    : `+91 ${national}`;
};
