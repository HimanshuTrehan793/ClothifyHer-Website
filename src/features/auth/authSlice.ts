import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";

/**
 * Why the login modal can interrupt: checkout, wishlist and account all need a
 * session. `intent` records what the user was trying to do so we can finish it
 * for them instead of dumping them on the home page after sign-in.
 */
export type LoginIntent = "checkout" | "wishlist" | "account" | "cart" | null;

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  loginOpen: boolean;
  intent: LoginIntent;
}

const getInitialAuthState = (): AuthState => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  return {
    accessToken,
    isAuthenticated: !!accessToken,
    phoneNumber: localStorage.getItem("phoneNumber"),
    loginOpen: false,
    intent: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    openLogin: (state, action: PayloadAction<LoginIntent>) => {
      state.loginOpen = true;
      state.intent = action.payload;
    },
    closeLogin: (state) => {
      state.loginOpen = false;
      state.intent = null;
    },

    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string; phone_number?: string }>,
    ) => {
      state.accessToken = action.payload.access_token;
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.access_token);
      if (action.payload.phone_number) {
        state.phoneNumber = action.payload.phone_number;
        localStorage.setItem("phoneNumber", action.payload.phone_number);
      }
      state.isAuthenticated = true;
      state.loginOpen = false;
    },

    logout: (state) => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem("phoneNumber");
      state.accessToken = null;
      state.phoneNumber = null;
      state.isAuthenticated = false;
      state.intent = null;
    },
  },
});

export const { openLogin, closeLogin, setCredentials, logout } =
  authSlice.actions;

export const selectIsAuthenticated = (s: RootState) => s.auth.isAuthenticated;
export const selectLoginOpen = (s: RootState) => s.auth.loginOpen;
export const selectLoginIntent = (s: RootState) => s.auth.intent;
export const selectPhoneNumber = (s: RootState) => s.auth.phoneNumber;

export default authSlice.reducer;
