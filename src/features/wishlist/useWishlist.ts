import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import type { Product } from "@/interfaces/catalog";
import type { WishlistEntry } from "@/interfaces/cart";
import {
  removeFromWishlist as removeLocal,
  selectWishlist,
  toggleWishlist as toggleLocal,
} from "./wishlistSlice";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "./wishlistApi";

/**
 * One wishlist API for the whole UI. Signed in, the server is the source of
 * truth (persists across devices); as a guest it's the localStorage slice.
 * Components never branch on auth — they read `ids`/`entries` and call
 * `toggle`/`remove`.
 */
export function useWishlist() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const local = useAppSelector(selectWishlist);
  const { data: server } = useGetWishlistQuery(undefined, { skip: !isAuth });
  const [addServer] = useAddToWishlistMutation();
  const [removeServer] = useRemoveFromWishlistMutation();

  const entries = useMemo<WishlistEntry[]>(
    () => (isAuth ? (server ?? []) : local),
    [isAuth, server, local],
  );
  const ids = useMemo(
    () => new Set(entries.map((e) => e.product.id)),
    [entries],
  );

  const toggle = (product: Product) => {
    if (!isAuth) {
      dispatch(toggleLocal(product));
      return;
    }
    if (ids.has(product.id)) removeServer(product.id);
    else addServer(product.id);
  };

  const remove = (productId: string) => {
    if (!isAuth) {
      dispatch(removeLocal(productId));
      return;
    }
    removeServer(productId);
  };

  return {
    entries,
    ids,
    count: entries.length,
    toggle,
    remove,
    isServer: isAuth,
  };
}
