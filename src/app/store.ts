import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/user/userSlice";
import cartReducer from "@/features/cart/cartSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";

/**
 * Register each new RTK Query slice in BOTH `reducer` and `middleware`:
 *
 *   [xAPI.reducerPath]: xAPI.reducer,   // reducer
 *   xAPI.middleware,                    // middleware
 *
 * cart / wishlist are plain slices persisted to localStorage — they become
 * API-backed in Phase 2.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
