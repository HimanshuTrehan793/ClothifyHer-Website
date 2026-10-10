export const APP_NAME = "ClothifyHer";
export const SITE_URL = "https://clothifyher.in";

/* Shared product links point at the backend's `/s/<slug>` route, which serves
   per-product Open Graph tags so WhatsApp shows the product's own photo — the
   storefront's tags are written by JavaScript, which link crawlers never run.
   Set VITE_SHARE_BASE_URL to a domain that proxies /s/* if you'd rather the
   shared URL read clothifyher.in. */
export const SHARE_BASE_URL = (
  (import.meta.env.VITE_SHARE_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  SITE_URL
).replace(/\/$/, "");

export const ACCESS_TOKEN_KEY = "accessToken";
export const CART_STORAGE_KEY = "clothifyher.cart";
export const WISHLIST_STORAGE_KEY = "clothifyher.wishlist";
export const RECENT_SEARCHES_KEY = "clothifyher.recentSearches";
export const PROFILE_STORAGE_KEY = "clothifyher.profile";
export const ADDRESSES_STORAGE_KEY = "clothifyher.addresses";

export const CURRENCY_SYMBOL = "₹";
export const DEFAULT_PAGE_SIZE = 20;

/* ── Sizing ────────────────────────────────────────────────────────────
   The full size ladder the store offers, XS through 10XL (XXL = 2XL). One
   source of truth: the size filter, the product size picker's defaults and
   the size guide all derive from this order. */
export const SIZE_SCALE = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "7XL",
  "8XL",
  "9XL",
  "10XL",
];

/* ── Commerce rules — mirror these in the backend once it exists ───── */
export const FREE_DELIVERY_ABOVE = 1499;
export const DELIVERY_FEE = 99;
export const GIFT_WRAP_FEE = 49;
export const MAX_QTY_PER_LINE = 5;

/* ── OTP login ─────────────────────────────────────────────────────── */
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 30;
export const OTP_MAX_ATTEMPTS = 3;
