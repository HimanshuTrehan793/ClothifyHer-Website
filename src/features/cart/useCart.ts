import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openLogin, selectIsAuthenticated } from "@/features/auth/authSlice";
import { useGetConfigurationQuery } from "@/features/configuration/configurationApi";
import type { CartLine, CartTotals } from "@/interfaces/cart";
import { removeCoupon, selectCoupon } from "./cartSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "./cartApi";

const EMPTY_LINES: CartLine[] = [];

/**
 * One cart API for the whole UI. The bag is account-scoped — the server prices
 * every line, so nothing here recomputes money from the catalog. A guest has no
 * cart: `add` opens the login dialog instead, which is what the Cart screen
 * already tells people ("your bag is saved to your account").
 *
 * Delivery fee and the free-delivery threshold come from `/api/configurations`
 * so the dashboard can change them without a redeploy.
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const coupon = useAppSelector(selectCoupon);

  const { data, isLoading, isFetching } = useGetCartQuery(undefined, {
    skip: !isAuth,
  });
  const { data: config } = useGetConfigurationQuery();

  const [addServer, addState] = useAddToCartMutation();
  const [updateServer] = useUpdateCartItemMutation();
  const [removeServer] = useRemoveCartItemMutation();

  const lines = data?.lines ?? EMPTY_LINES;

  const totals = useMemo<CartTotals>(() => {
    const itemTotal = data?.summary.subtotal ?? 0;
    const itemMrpTotal = data?.summary.totalMrp ?? 0;

    /* Mirror the server's own coupon maths (utils/discount.ts) so the summary
       matches the order that gets placed. The authoritative number still comes
       from /api/coupons/validate when the code is applied. */
    let couponDiscount = 0;
    if (coupon && itemTotal >= coupon.minOrderValue) {
      // `Math.floor` matches computeDiscount() on the server — without it the
      // summary can promise a rupee more off than the order actually applies.
      couponDiscount =
        coupon.type === "flat"
          ? coupon.value
          : Math.floor((itemTotal * coupon.value) / 100);
      if (coupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      }
      couponDiscount = Math.min(couponDiscount, itemTotal);
    }

    const afterDiscount = itemTotal - couponDiscount;
    const threshold = config?.freeShippingThreshold ?? 0;
    const fee = config?.shippingFee ?? 0;
    // Free delivery is decided on the post-discount total, as placeOrder does.
    const deliveryFee =
      itemTotal === 0 || afterDiscount >= threshold ? 0 : fee;

    return {
      itemTotal,
      itemMrpTotal,
      couponDiscount,
      deliveryFee,
      grandTotal: afterDiscount + deliveryFee,
      freeDeliveryGap: Math.max(0, threshold - afterDiscount),
    };
  }, [data, coupon, config]);

  const count = data?.summary.itemCount ?? 0;

  /* Stable identity: the Cart screen drops the coupon from an effect, so an
     inline arrow here would re-run that effect on every render. */
  const clearCoupon = useCallback(() => {
    dispatch(removeCoupon());
  }, [dispatch]);

  /** Add a priced size×colour unit. Guests get the login dialog instead. */
  const add = (variantSizeId: string, quantity = 1) => {
    if (!isAuth) {
      dispatch(openLogin("cart"));
      return;
    }
    addServer({ variant_size_id: variantSizeId, quantity });
  };

  const setQuantity = (line: CartLine, quantity: number) => {
    if (!line.serverItemId) return;
    if (quantity <= 0) {
      removeServer(line.serverItemId);
      return;
    }
    updateServer({ id: line.serverItemId, quantity });
  };

  const remove = (line: CartLine) => {
    if (!line.serverItemId) return;
    removeServer(line.serverItemId);
  };

  return {
    lines,
    totals,
    count,
    coupon,
    /** Drop the applied coupon — used when the cart falls below its minimum. */
    clearCoupon,
    add,
    setQuantity,
    remove,
    isAuthenticated: isAuth,
    isLoading: isAuth && isLoading,
    isFetching,
    isAdding: addState.isLoading,
    /** Set once the store is closed — checkout will refuse the order. */
    storeClosed: config ? !config.storeActive : false,
    codEnabled: config?.codEnabled ?? false,
    /** Spend needed for free delivery, as configured in the dashboard. */
    freeShippingThreshold: config?.freeShippingThreshold ?? 0,
    /** Any line whose colour went out of stock — checkout will 409 on these. */
    hasOutOfStock: lines.some((l) => l.outOfStock),
  };
}
