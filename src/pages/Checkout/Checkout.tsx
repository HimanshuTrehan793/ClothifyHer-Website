import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import { Banknote, MapPin, Plus, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/bits/BackButton";
import { SiteFooter } from "@/components/common/SiteFooter";
import { AddressDialog } from "@/components/dialog/AddressDialog";
import { AddressMapDialog } from "@/components/dialog/AddressMapDialog";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openLogin, selectPhoneNumber } from "@/features/auth/authSlice";
import { selectProfile } from "@/features/user/userSlice";
import { useCart } from "@/features/cart/useCart";
import { getLocationPermission } from "@/utils/geolocation";
import {
  useCreateAddressMutation,
  useGetAddressesQuery,
} from "@/features/address/addressApi";
import {
  usePlaceOrderMutation,
  useVerifyPaymentMutation,
  type PlaceOrderArgs,
} from "@/features/orders/orderApi";
import { loadRazorpay } from "@/utils/razorpay";
import { formatPrice } from "@/utils/format";
import type { SavedAddress } from "@/interfaces/user";

type PaymentMethod = PlaceOrderArgs["payment_method"];

const BRAND_MAROON = "#5A1D29";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    lines,
    totals,
    coupon,
    isLoading: cartLoading,
    isAuthenticated,
    storeClosed,
    hasOutOfStock,
    codEnabled,
  } = useCart();

  const { data: addresses = [], isLoading: addressesLoading } =
    useGetAddressesQuery(undefined, { skip: !isAuthenticated });
  const [createAddress, { isLoading: savingAddress }] =
    useCreateAddressMutation();
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [verifyPayment, { isLoading: verifying }] = useVerifyPaymentMutation();

  const profile = useAppSelector(selectProfile);
  const phone = useAppSelector(selectPhoneNumber);

  const [addressId, setAddressId] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("razorpay");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [prefill, setPrefill] = useState<Partial<SavedAddress> | null>(null);
  const [error, setError] = useState<string | null>(null);
  /* The Razorpay popup is a separate window, so this page stays interactive
     while it's open — without this the pay button invites a second order. */
  const [gatewayOpen, setGatewayOpen] = useState(false);

  /* Default to the address the customer marked default, else the newest one.
     Re-runs when a freshly added address arrives so it selects itself. */
  useEffect(() => {
    if (!addresses.length) return;
    setAddressId((current) => {
      if (current && addresses.some((a) => a.id === current)) return current;
      return (addresses.find((a) => a.isDefault) ?? addresses[0]).id;
    });
  }, [addresses]);

  // COD can be switched off in the dashboard; never leave it selected then.
  useEffect(() => {
    if (!codEnabled && method === "cod") setMethod("razorpay");
  }, [codEnabled, method]);

  const selected = useMemo(
    () => addresses.find((a) => a.id === addressId) ?? null,
    [addresses, addressId],
  );

  const busy = placing || verifying || gatewayOpen;
  const blocked = storeClosed || hasOutOfStock || !lines.length;

  /* Location off → the map can't centre on them and they'd be dragging from a
     default city, so go straight to the form. */
  const startAddAddress = async () => {
    setPrefill(null);
    if ((await getLocationPermission()) === "denied") {
      setDialogOpen(true);
      return;
    }
    setMapOpen(true);
  };

  const goToOrder = (orderId: string) => navigate(`/orders/${orderId}`);

  const submit = async () => {
    setError(null);
    if (!addressId) {
      setError("Choose a delivery address to continue.");
      return;
    }

    let result;
    try {
      result = await placeOrder({
        address_id: addressId,
        payment_method: method,
        ...(coupon ? { coupon_code: coupon.code } : {}),
      }).unwrap();
    } catch {
      /* The base query toasts the server's reason (out of stock, store closed). */
      setError("We couldn't place the order. Please try again.");
      return;
    }

    // COD is done the moment the server accepts it.
    if (!result.razorpay) {
      goToOrder(result.order.id);
      return;
    }

    const ready = await loadRazorpay();
    if (!ready) {
      /* The order is saved and unpaid. There's no way to pay it later yet, so
         say what actually happened rather than promising a retry screen. */
      setError(
        "Couldn't reach Razorpay. Your order is saved but unpaid — check your connection, then contact us to complete it.",
      );
      return;
    }

    const gateway = result.razorpay;
    const rzp = new window.Razorpay({
      key: gateway.key_id,
      amount: gateway.amount,
      currency: gateway.currency,
      name: "ClothifyHer",
      description: `Order ${result.order.orderNumber ?? ""}`.trim(),
      order_id: gateway.razorpay_order_id,
      prefill: {
        name: profile?.fullName || selected?.name || "",
        email: profile?.email || "",
        contact: phone || selected?.phone || "",
      },
      theme: { color: BRAND_MAROON },
      handler: async (response) => {
        setGatewayOpen(false);
        try {
          await verifyPayment(response).unwrap();
        } catch {
          /* The webhook still confirms it server-side; the order screen shows
             the real state, so never claim failure here. */
        }
        goToOrder(result.order.id);
      },
      modal: {
        ondismiss: () => {
          setGatewayOpen(false);
          /* Your bag is untouched until payment lands, so the honest advice is
             simply to pay again — that places a fresh order. */
          setError(
            "Payment cancelled. Your bag is still here — press Pay again when you're ready.",
          );
        },
      },
    });
    setGatewayOpen(true);
    rzp.open();
  };

  if (!isAuthenticated) {
    return (
      <Guard
        title="Sign in to check out"
        message="Your bag and addresses are saved to your account."
        action={
          <button
            type="button"
            onClick={() => dispatch(openLogin("checkout"))}
            className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors"
          >
            Sign in
          </button>
        }
      />
    );
  }

  if (!cartLoading && !lines.length) {
    return (
      <Guard
        title="Your bag is empty"
        message="Add something you love, then come back to check out."
        action={
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors"
          >
            Continue shopping
          </button>
        }
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — ClothifyHer</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <BackButton fallback="/cart" className="mb-4" />
        <h1 className="font-serif text-3xl text-stone-900">Checkout</h1>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            {/* ── Address ─────────────────────────────────────────── */}
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <MapPin className="text-maroon-700 h-4 w-4" />
                  Delivery address
                </h2>
                <button
                  type="button"
                  onClick={() => void startAddAddress()}
                  className="text-maroon-700 inline-flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" /> Add new
                </button>
              </div>

              {addressesLoading ? (
                <p className="mt-4 text-sm text-stone-500">
                  Loading addresses…
                </p>
              ) : addresses.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">
                  No saved addresses yet. Add one to continue.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {addresses.map((a) => (
                    <li key={a.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors",
                          a.id === addressId
                            ? "border-maroon-700 bg-maroon-50/40"
                            : "border-stone-200 hover:border-stone-300",
                        )}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={a.id === addressId}
                          onChange={() => setAddressId(a.id)}
                          className="accent-maroon-800 mt-1 h-4 w-4 shrink-0"
                        />
                        <span className="min-w-0 text-sm">
                          <span className="block font-medium text-stone-900">
                            {a.name}
                            <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
                              {a.type}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-stone-600">
                            {[a.line1, a.line2, a.landmark]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                          <span className="block text-stone-600">
                            {a.city}, {a.state} {a.pincode}
                          </span>
                          <span className="mt-0.5 block text-stone-500">
                            {a.phone}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ── Payment ─────────────────────────────────────────── */}
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-semibold text-stone-900">Payment</h2>
              <div className="mt-4 space-y-3">
                <PaymentOption
                  icon={<Wallet className="h-4 w-4" />}
                  label="Pay online"
                  hint="UPI, cards, netbanking and wallets via Razorpay"
                  checked={method === "razorpay"}
                  onSelect={() => setMethod("razorpay")}
                />
                {codEnabled && (
                  <PaymentOption
                    icon={<Banknote className="h-4 w-4" />}
                    label="Cash on delivery"
                    hint="Pay the courier when it arrives"
                    checked={method === "cod"}
                    onSelect={() => setMethod("cod")}
                  />
                )}
              </div>
            </section>
          </div>

          {/* ── Summary ───────────────────────────────────────────── */}
          <aside className="min-w-0 lg:col-span-5">
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-semibold text-stone-900">
                Order summary
              </h2>

              <dl className="mt-4 space-y-2.5 text-sm">
                <Row
                  label={`Item total (${lines.length})`}
                  value={formatPrice(totals.itemTotal)}
                />
                {totals.couponDiscount > 0 && (
                  <Row
                    label={`Coupon${coupon ? ` (${coupon.code})` : ""}`}
                    value={`− ${formatPrice(totals.couponDiscount)}`}
                    positive
                  />
                )}
                <Row
                  label="Delivery"
                  value={
                    totals.deliveryFee === 0
                      ? "FREE"
                      : formatPrice(totals.deliveryFee)
                  }
                  positive={totals.deliveryFee === 0}
                />
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.grandTotal)}</dd>
                </div>
              </dl>

              {storeClosed && (
                <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                  The store is temporarily closed and isn't accepting orders.
                </p>
              )}
              {hasOutOfStock && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  Remove the out-of-stock items in your bag to continue.
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={busy || blocked || !addressId}
                className="bg-maroon-800 hover:bg-maroon-900 mt-5 h-12 w-full rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50"
              >
                {busy
                  ? "Please wait…"
                  : method === "cod"
                    ? "Place order"
                    : `Pay ${formatPrice(totals.grandTotal)}`}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payments secured by Razorpay
              </p>
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />

      {/* Map first, then the form prefilled with what the pin resolved. */}
      <AddressMapDialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={(fields) => {
          setPrefill(fields);
          setMapOpen(false);
          setDialogOpen(true);
        }}
        onSkip={() => {
          setPrefill(null);
          setMapOpen(false);
          setDialogOpen(true);
        }}
      />

      <AddressDialog
        open={dialogOpen}
        address={null}
        prefill={prefill}
        onClose={() => setDialogOpen(false)}
        onSave={async (address: SavedAddress) => {
          setDialogOpen(false);
          if (savingAddress) return;
          try {
            const created = await createAddress(address).unwrap();
            setAddressId(created.id);
          } catch {
            /* toasted by the base query */
          }
        }}
      />
    </>
  );
}

function PaymentOption({
  icon,
  label,
  hint,
  checked,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
        checked
          ? "border-maroon-700 bg-maroon-50/40"
          : "border-stone-200 hover:border-stone-300",
      )}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        onChange={onSelect}
        className="accent-maroon-800 mt-1 h-4 w-4 shrink-0"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-medium text-stone-900">
          {icon}
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-stone-500">{hint}</span>
      </span>
    </label>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-600">{label}</dt>
      <dd
        className={cn(
          positive ? "font-medium text-green-700" : "text-stone-900",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Guard({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>Checkout — ClothifyHer</title>
      </Helmet>
      <div className="mx-auto flex max-w-sm flex-col items-center px-6 pt-16 pb-20 text-center">
        <h1 className="font-serif text-2xl text-stone-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">{message}</p>
        {action}
      </div>
      <SiteFooter />
    </>
  );
}
