import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import {
  clearWishlist,
  selectWishlist,
} from "@/features/wishlist/wishlistSlice";
import { useMergeWishlistMutation } from "@/features/wishlist/wishlistApi";

/** Catalog ids are UUIDs. Anything else in a guest wishlist is stale local
    data the server won't recognise, so it's dropped or the batch 400s. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Cross-session sync that runs once per login. The moment auth flips from guest
 * to signed-in, the local (localStorage) wishlist is merged into the account and
 * then cleared, so the server becomes the single source of truth. Mounted once
 * in App, renders nothing.
 */
export function AuthSync() {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const localEntries = useAppSelector(selectWishlist);
  const dispatch = useAppDispatch();
  const [mergeWishlist] = useMergeWishlistMutation();
  const wasAuth = useRef(isAuth);

  useEffect(() => {
    const justLoggedIn = !wasAuth.current && isAuth;
    wasAuth.current = isAuth;
    if (!justLoggedIn) return;

    const ids = localEntries
      .map((e) => e.product.id)
      .filter((id) => UUID_RE.test(id));

    // Clear the guest copy regardless — the server is now the source of truth.
    if (!ids.length) {
      dispatch(clearWishlist());
      return;
    }

    mergeWishlist(ids)
      .unwrap()
      .catch(() => {
        /* server refetch still reflects whatever merged; ignore failures */
      })
      .finally(() => dispatch(clearWishlist()));
  }, [isAuth, localEntries, dispatch, mergeWishlist]);

  return null;
}
