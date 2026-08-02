import type { SavedAddress, UserProfile } from "@/interfaces/user";

/**
 * Demo seed — the profile and addresses a signed-in user starts with.
 * Delete both once /api/users and /api/addresses exist.
 * To see the empty states again: localStorage.clear()
 */
export const DEMO_PROFILE: UserProfile = {
  fullName: "Ananya Rao",
  email: "ananya.rao@example.com",
  phoneNumber: "9876543210",
  gender: "female",
  dateOfBirth: "1996-04-18",
};

export const DEMO_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    type: "home",
    name: "Ananya Rao",
    phone: "9876543210",
    line1: "402, Sunrise Residency",
    line2: "12th Main, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "work",
    name: "Ananya Rao",
    phone: "9876543210",
    line1: "Level 6, Prestige Tech Park",
    line2: "Marathahalli Outer Ring Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    isDefault: false,
  },
];
