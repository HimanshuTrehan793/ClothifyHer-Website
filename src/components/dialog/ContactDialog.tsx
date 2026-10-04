import { Mail, Phone } from "lucide-react";
import { Modal } from "./Modal";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  email?: string | null;
  phone?: string | null;
}

/**
 * "We're here to help" — the support details from store configuration.
 *
 * Rows are real `mailto:`/`tel:` links so a tap dials or opens mail on a
 * phone, and the text stays selectable for anyone copying it on a desktop.
 */
export function ContactDialog({
  open,
  onClose,
  email,
  phone,
}: ContactDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contact us"
      className="max-w-sm"
    >
      <h2 className="text-center font-serif text-2xl text-stone-900">
        Contact Us
      </h2>
      <p className="mt-1 text-center text-sm text-stone-500">
        We're here to help.
      </p>

      <div className="mt-6 space-y-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="hover:border-maroon-300 flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 transition-colors"
          >
            <span className="bg-maroon-50 grid h-10 w-10 shrink-0 place-items-center rounded-full">
              <Mail className="text-maroon-700 h-4 w-4" />
            </span>
            <span className="min-w-0 truncate text-sm text-stone-800">
              {email}
            </span>
          </a>
        )}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="hover:border-maroon-300 flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 transition-colors"
          >
            <span className="bg-maroon-50 grid h-10 w-10 shrink-0 place-items-center rounded-full">
              <Phone className="text-maroon-700 h-4 w-4" />
            </span>
            <span className="text-sm text-stone-800">{phone}</span>
          </a>
        )}

        {/* Configuration can legitimately have neither set. */}
        {!email && !phone && (
          <p className="text-center text-sm text-stone-500">
            Support contact details aren't available right now.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="bg-maroon-800 hover:bg-maroon-900 mt-6 h-12 w-full rounded-full text-sm font-semibold text-white transition-colors"
      >
        Close
      </button>
    </Modal>
  );
}
