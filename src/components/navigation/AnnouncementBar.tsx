import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGetConfigurationQuery } from "@/features/configuration/configurationApi";

const MESSAGES = [
  "Free shipping on orders above ₹1,499",
  "Extra 10% off your first order — code WELCOME10",
  "Easy 7-day returns on everything",
];

const DISMISS_KEY = "announcementDismissed";
const ROTATE_MS = 4500;

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true); // assume hidden until checked
  const [index, setIndex] = useState(0);

  /* Store-controlled announcement. When the merchant has turned one on we show
     that single line; otherwise we fall back to the rotating house messages so
     the bar never goes empty while config is loading or disabled. */
  const { data: config } = useGetConfigurationQuery();
  const messages =
    config?.announcementEnabled && config.announcementText
      ? [config.announcementText]
      : MESSAGES;

  // Read once on mount so the bar never flashes for someone who closed it.
  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  useEffect(() => {
    if (dismissed || messages.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [dismissed, messages.length]);

  if (dismissed) return null;

  const close = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="bg-maroon-800 relative text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-10">
        <p
          key={index}
          aria-live="polite"
          className="animate-[fadeIn_400ms_ease-out] text-center text-[12px] font-medium tracking-wide sm:text-[13px]"
        >
          {messages[index % messages.length]}
        </p>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
