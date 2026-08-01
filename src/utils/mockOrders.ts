import type { Order, OrderItem } from "@/interfaces/order";
import { CATALOG } from "@/utils/mockData";

/** Builds an order line from the catalog so imagery and prices stay in sync. */
const line = (productId: string, size: string, quantity = 1): OrderItem => {
  const p = CATALOG.find((x) => x.id === productId)!;
  return {
    productId: p.id,
    brand: p.brand,
    title: p.title,
    image: p.image,
    size,
    quantity,
    price: p.price,
    mrp: p.mrp,
  };
};

const ADDRESS = {
  name: "Ananya Rao",
  line1: "402, Sunrise Residency",
  line2: "12th Main, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  phone: "+91 98765 43210",
};

/** Sums the money fields so the summary can never disagree with the lines. */
const totals = (
  items: OrderItem[],
  opts: { coupon?: number; giftWrap?: number; delivery?: number } = {},
) => {
  const itemTotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const itemMrpTotal = items.reduce(
    (n, i) => n + (i.mrp ?? i.price) * i.quantity,
    0,
  );
  const couponDiscount = opts.coupon ?? 0;
  const giftWrapFee = opts.giftWrap ?? 0;
  const deliveryFee = opts.delivery ?? 0;
  return {
    itemTotal,
    itemMrpTotal,
    couponDiscount,
    giftWrapFee,
    deliveryFee,
    total: itemTotal - couponDiscount + giftWrapFee + deliveryFee,
  };
};

/**
 * Four orders covering the states worth designing for: mid-transit,
 * just-placed, delivered (returnable) and cancelled.
 */
export const ORDERS: Order[] = [
  (() => {
    const items = [line("p3", "M"), line("t2", "S", 2)];
    return {
      id: "CH-2026-4821",
      placedAt: "29 Jul 2026",
      status: "out-for-delivery" as const,
      items,
      address: ADDRESS,
      paymentMethod: "upi" as const,
      ...totals(items, { coupon: 500 }),
      couponCode: "WELCOME10",
      events: [
        { status: "confirmed" as const, at: "29 Jul, 2:14 PM" },
        { status: "packed" as const, at: "30 Jul, 10:02 AM" },
        { status: "shipped" as const, at: "30 Jul, 6:40 PM" },
        { status: "out-for-delivery" as const, at: "1 Aug, 8:15 AM" },
      ],
      expectedDelivery: "Today by 7 PM",
      courier: "Bluedart",
      trackingId: "BD3948571023",
    };
  })(),

  (() => {
    const items = [line("k2", "L")];
    return {
      id: "CH-2026-4790",
      placedAt: "27 Jul 2026",
      status: "confirmed" as const,
      items,
      address: ADDRESS,
      paymentMethod: "cod" as const,
      ...totals(items, { delivery: 99, giftWrap: 49 }),
      events: [{ status: "confirmed" as const, at: "27 Jul, 9:31 PM" }],
      expectedDelivery: "4 – 6 Aug",
    };
  })(),

  (() => {
    const items = [line("p1", "M"), line("b3", "M"), line("t1", "S")];
    return {
      id: "CH-2026-4612",
      placedAt: "14 Jul 2026",
      status: "delivered" as const,
      items,
      address: ADDRESS,
      paymentMethod: "card" as const,
      ...totals(items, { coupon: 300 }),
      couponCode: "FLAT300",
      events: [
        { status: "confirmed" as const, at: "14 Jul, 11:05 AM" },
        { status: "packed" as const, at: "15 Jul, 9:20 AM" },
        { status: "shipped" as const, at: "15 Jul, 4:55 PM" },
        { status: "out-for-delivery" as const, at: "18 Jul, 7:40 AM" },
        { status: "delivered" as const, at: "18 Jul, 1:26 PM" },
      ],
      courier: "Delhivery",
      trackingId: "DL7761204488",
    };
  })(),

  (() => {
    const items = [line("d1", "M")];
    return {
      id: "CH-2026-4405",
      placedAt: "2 Jul 2026",
      status: "cancelled" as const,
      items,
      address: ADDRESS,
      paymentMethod: "netbanking" as const,
      ...totals(items),
      events: [
        { status: "confirmed" as const, at: "2 Jul, 3:12 PM" },
        { status: "cancelled" as const, at: "3 Jul, 10:47 AM" },
      ],
      cancelledReason: "Cancelled at your request — refund issued to source",
    };
  })(),
];

export const findOrder = (id: string) => ORDERS.find((o) => o.id === id);
