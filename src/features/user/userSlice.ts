import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { UserProfile } from "@/interfaces/user";
import { PROFILE_STORAGE_KEY } from "@/utils/constants";
import { readJSON, writeJSON } from "@/utils/storage";

/**
 * Addresses moved to the API (`/api/addresses` — see `addressApi`). What's left
 * here is the display profile, which has no endpoint behind it: the backend
 * stores name/email/gender on the user row but exposes no route to read or
 * update them, so these fields persist to localStorage only and won't follow
 * the account to another device. Move them onto the API as soon as a profile
 * endpoint exists.
 */
interface UserState {
  profile: UserProfile;
}

const EMPTY_PROFILE: UserProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "unspecified",
  dateOfBirth: "",
};

const initialState: UserState = {
  profile:
    readJSON<UserProfile | null>(PROFILE_STORAGE_KEY, null) ?? EMPTY_PROFILE,
};

const persistProfile = (s: UserState) =>
  writeJSON(PROFILE_STORAGE_KEY, s.profile);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      persistProfile(state);
    },

    clearProfile: (state) => {
      state.profile = EMPTY_PROFILE;
      persistProfile(state);
    },
  },
});

export const { updateProfile, clearProfile } = userSlice.actions;

export const selectProfile = (s: RootState) => s.user.profile;

export default userSlice.reducer;
