import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { SavedAddress, UserProfile } from "@/interfaces/user";
import { PROFILE_STORAGE_KEY, ADDRESSES_STORAGE_KEY } from "@/utils/constants";
import { readJSON, writeJSON } from "@/utils/storage";
import { DEMO_ADDRESSES, DEMO_PROFILE } from "@/utils/mockUser";

interface UserState {
  profile: UserProfile;
  addresses: SavedAddress[];
}

/* Demo seed only on a first visit, same convention as cart and wishlist. */
const initialState: UserState = {
  profile:
    readJSON<UserProfile | null>(PROFILE_STORAGE_KEY, null) ?? DEMO_PROFILE,
  addresses:
    readJSON<SavedAddress[] | null>(ADDRESSES_STORAGE_KEY, null) ??
    DEMO_ADDRESSES,
};

const persistProfile = (s: UserState) =>
  writeJSON(PROFILE_STORAGE_KEY, s.profile);
const persistAddresses = (s: UserState) =>
  writeJSON(ADDRESSES_STORAGE_KEY, s.addresses);

/** Keeps the "exactly one default" invariant in one place. */
const makeDefault = (addresses: SavedAddress[], id: string) =>
  addresses.forEach((a) => {
    a.isDefault = a.id === id;
  });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      persistProfile(state);
    },

    addAddress: (state, action: PayloadAction<SavedAddress>) => {
      // First address is always the default — nothing else to fall back to.
      const address = {
        ...action.payload,
        isDefault: state.addresses.length === 0 || action.payload.isDefault,
      };
      state.addresses.push(address);
      if (address.isDefault) makeDefault(state.addresses, address.id);
      persistAddresses(state);
    },

    updateAddress: (state, action: PayloadAction<SavedAddress>) => {
      const index = state.addresses.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index === -1) return;
      state.addresses[index] = action.payload;
      if (action.payload.isDefault)
        makeDefault(state.addresses, action.payload.id);
      persistAddresses(state);
    },

    removeAddress: (state, action: PayloadAction<string>) => {
      const wasDefault = state.addresses.find(
        (a) => a.id === action.payload,
      )?.isDefault;
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      // Deleting the default promotes the next one rather than leaving none.
      if (wasDefault && state.addresses.length) {
        state.addresses[0].isDefault = true;
      }
      persistAddresses(state);
    },

    setDefaultAddress: (state, action: PayloadAction<string>) => {
      makeDefault(state.addresses, action.payload);
      persistAddresses(state);
    },
  },
});

export const {
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} = userSlice.actions;

export const selectProfile = (s: RootState) => s.user.profile;
export const selectAddresses = (s: RootState) => s.user.addresses;
export const selectDefaultAddress = (s: RootState) =>
  s.user.addresses.find((a) => a.isDefault) ?? s.user.addresses[0] ?? null;

export default userSlice.reducer;
