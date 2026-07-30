import { Award, RotateCcw, Truck } from "lucide-react";

const PROMISES = [
  {
    icon: Award,
    title: "Authentic Brands",
    caption: "Sourced direct from Indian ateliers",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns",
    caption: "Free pickup, no questions asked",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    caption: "On every order above ₹1,999",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-10">
        {PROMISES.map(({ icon: Icon, title, caption }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="bg-maroon-50 text-maroon-700 grid h-11 w-11 shrink-0 place-items-center rounded-full">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-900">{title}</p>
              <p className="text-xs text-stone-500">{caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
