/**
 * Fulfilment states from flow doc §15, plus the two the doc omits but every
 * real store hits: a customer cancellation and a return.
 */
export type OrderStatus =
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned";

/** The happy path, in order. Cancelled/returned sit outside it. */
export const FULFILMENT_STEPS: {
  status: OrderStatus;
  label: string;
  hint: string;
}[] = [
  {
    status: "confirmed",
    label: "Order Confirmed",
    hint: "We've received your order",
  },
  { status: "packed", label: "Packed", hint: "Your order is ready to ship" },
  {
    status: "shipped",
    label: "Shipped",
    hint: "Handed to our delivery partner",
  },
  {
    status: "out-for-delivery",
    label: "Out for Delivery",
    hint: "Arriving today",
  },
  { status: "delivered", label: "Delivered", hint: "Left at your doorstep" },
];

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export interface OrderItem {
  productId: string;
  brand: string;
  title: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  mrp?: number;
}

export interface OrderAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderEvent {
  status: OrderStatus;
  /** Absent while the step hasn't happened yet. */
  at?: string;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  itemTotal: number;
  itemMrpTotal: number;
  couponDiscount: number;
  couponCode?: string;
  giftWrapFee: number;
  deliveryFee: number;
  total: number;
  /** Timestamps for whichever steps have happened so far. */
  events: OrderEvent[];
  expectedDelivery?: string;
  courier?: string;
  trackingId?: string;
  /** Set when status is `cancelled` — shown instead of the timeline tail. */
  cancelledReason?: string;
}
