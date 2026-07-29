import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

/**
 * Register each new RTK Query slice in BOTH `reducer` and `middleware`:
 *
 *   [xAPI.reducerPath]: xAPI.reducer,   // reducer
 *   xAPI.middleware,                    // middleware
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
