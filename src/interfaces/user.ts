export type Gender = "female" | "male" | "other" | "unspecified";

export interface UserProfile {
  fullName: string;
  email: string;
  /** Owned by auth — mirrored here for display, never edited on this screen. */
  phoneNumber: string;
  gender: Gender;
  /** ISO yyyy-mm-dd, so it drops straight into <input type="date">. */
  dateOfBirth: string;
}

export type AddressType = "home" | "work" | "other";

export interface SavedAddress {
  id: string;
  type: AddressType;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  /** Optional "near the temple" hint the API stores alongside the address. */
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  /** Exactly one address carries this at a time. */
  isDefault: boolean;
  /** Map pin, set when the address was picked on the map. */
  lat?: number | null;
  lng?: number | null;
}
