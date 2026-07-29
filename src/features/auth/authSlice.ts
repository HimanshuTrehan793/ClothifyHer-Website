import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  return {
    accessToken: accessToken,
    isAuthenticated: !!accessToken,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string }>,
    ) => {
      state.accessToken = action.payload.access_token;
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.access_token);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
