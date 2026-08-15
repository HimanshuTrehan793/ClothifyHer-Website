/**
 * Store configuration as the app consumes it — the normalized shape the
 * Configuration API slice produces. Money is in **rupees** (the API sends
 * rupees), matching how the rest of the UI handles prices.
 */
export interface Configuration {
  storeActive: boolean;
  /** Flat delivery fee, in rupees. */
  shippingFee: number;
  /** Order value (rupees) at/above which delivery is free. */
  freeShippingThreshold: number;
  codEnabled: boolean;
  announcementEnabled: boolean;
  announcementText: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
}
