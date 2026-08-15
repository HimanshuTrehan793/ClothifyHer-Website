import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/api/baseApi";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/user/userSlice";
import cartReducer from "@/features/cart/cartSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";

/**
 * `baseApi` is the single RTK Query API — domain slices attach to it with
 * `injectEndpoints`, so there's one reducer and one middleware to register
 * here no matter how many slices exist.
 *
 * cart / wishlist are plain slices persisted to localStorage — they move onto
 * the API in the cart/wishlist phase.
 */
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Enables refetchOnFocus / refetchOnReconnect behaviours for RTK Query.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
