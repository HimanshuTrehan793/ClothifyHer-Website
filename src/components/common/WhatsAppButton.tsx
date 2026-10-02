import WhatsAppIcon from "@/assets/whatsapp.svg";

const PHONE = "919187638836";
const MESSAGE = "Hi";

/**
 * Floating "chat with us" button.
 *
 * A plain link to `wa.me`, not a scripted `window.open`: that one URL opens the
 * native app on phones and WhatsApp Web on desktop, and as a real anchor people
 * can long-press, copy it, or open it in a new tab.
 *
 * Sits above the product page's sticky buy bar on mobile (which is ~68px tall
 * plus the iOS home indicator), and below every dialog.
 */
export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-30 grid h-13 w-13 place-items-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <img src={WhatsAppIcon} alt="" className="h-7 w-7" />
    </a>
  );
}
