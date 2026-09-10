import { useState } from "react";
import { Facebook, Share2 } from "lucide-react";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "@/assets/whatsapp.svg";
import GmailIcon from "@/assets/gmail.svg";

type Platform = "facebook" | "whatsapp" | "gmail";

interface ShareButtonProps {
  /** What's being shared — used in the message and email subject. */
  title: string;
  /** Absolute URL to share. */
  url: string;
  className?: string;
}

/**
 * Web share URLs only. wa.me and the Facebook sharer already hand off to the
 * native app on phones, so there's no need for a `whatsapp://` / `fb://`
 * attempt first — that pattern opens the app *and* a browser tab.
 */
function shareUrl(platform: Platform, title: string, url: string): string {
  const link = encodeURIComponent(url);
  const message = encodeURIComponent(`Check out ${title} on ClothifyHer!`);
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${link}`;
    case "whatsapp":
      return `https://wa.me/?text=${message}%20${link}`;
    case "gmail":
      return `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(title)}&body=${message}%20${link}`;
  }
}

const OPTIONS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: <Facebook className="h-6 w-6 text-[#1877F2]" />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <img src={WhatsAppIcon} alt="" className="h-8 w-8" />,
  },
  {
    id: "gmail",
    label: "Gmail",
    icon: <img src={GmailIcon} alt="" className="h-7 w-7" />,
  },
];

/** Share icon button that opens a "Share via" dialog. Owns its open state. */
export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  const share = (platform: Platform) => {
    window.open(shareUrl(platform, title, url), "_blank", "noopener");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Share this product"
        className={cn(
          "hover:bg-maroon-50 hover:text-maroon-800 grid h-10 w-10 shrink-0 place-items-center rounded-full text-stone-700 transition-colors",
          className,
        )}
      >
        <Share2 className="h-5 w-5" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Share via"
        className="bg-white sm:max-w-sm"
      >
        <h2 className="pr-10 text-lg font-semibold text-stone-900">
          Share via
        </h2>

        <div className="mt-6 flex justify-around">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => share(o.id)}
              className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-stone-300 bg-white">
                {o.icon}
              </span>
              <span className="text-sm text-stone-800">{o.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
