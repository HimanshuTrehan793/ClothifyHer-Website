import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";
import type { AddressType, SavedAddress } from "@/interfaces/user";

const TYPES: { value: AddressType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

const blank = (): SavedAddress => ({
  id: "",
  type: "home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
});

interface AddressDialogProps {
  open: boolean;
  /** Present when editing; absent when adding. */
  address: SavedAddress | null;
  /** Fields carried over from the map picker when adding a new address. */
  prefill?: Partial<SavedAddress> | null;
  onClose: () => void;
  onSave: (address: SavedAddress) => void;
}

export function AddressDialog({
  open,
  address,
  prefill,
  onClose,
  onSave,
}: AddressDialogProps) {
  const [form, setForm] = useState<SavedAddress>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reload whenever the dialog opens so a cancelled edit never leaks through.
  useEffect(() => {
    if (!open) return;
    // Editing wins; otherwise start from whatever the map resolved.
    setForm(address ?? { ...blank(), ...(prefill ?? {}) });
    setErrors({});
  }, [open, address, prefill]);

  const set = (key: keyof SavedAddress, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter a name";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      next.phone = "Enter a valid 10-digit number";
    if (!form.line1.trim()) next.line1 = "Enter the address";
    if (!form.city.trim()) next.city = "Enter a city";
    if (!form.state.trim()) next.state = "Enter a state";
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = "Enter a 6-digit pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      id: form.id || `addr-${Date.now()}`,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={address ? "Edit address" : "Add address"}
      className="max-w-lg"
    >
      <h2 className="font-serif text-2xl text-stone-900">
        {address ? "Edit address" : "Add a new address"}
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("type", t.value)}
              aria-pressed={form.type === t.value}
              className={cn(
                "h-10 rounded-full border px-5 text-sm font-medium transition-colors",
                form.type === t.value
                  ? "border-maroon-800 bg-maroon-800 text-white"
                  : "hover:border-maroon-600 border-stone-300 text-stone-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            value={form.name}
            onChange={(v) => set("name", v)}
            error={errors.name}
          />
          <Field
            label="Mobile number"
            value={form.phone}
            onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
            error={errors.phone}
            inputMode="numeric"
          />
        </div>

        <Field
          label="Flat, house no., building"
          value={form.line1}
          onChange={(v) => set("line1", v)}
          error={errors.line1}
        />
        <Field
          label="Area, street, landmark (optional)"
          value={form.line2 ?? ""}
          onChange={(v) => set("line2", v)}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="City"
            value={form.city}
            onChange={(v) => set("city", v)}
            error={errors.city}
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => set("state", v)}
            error={errors.state}
          />
          <Field
            label="Pincode"
            value={form.pincode}
            onChange={(v) => set("pincode", v.replace(/\D/g, "").slice(0, 6))}
            error={errors.pincode}
            inputMode="numeric"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => set("isDefault", e.target.checked)}
            className="accent-maroon-800 h-4 w-4"
          />
          Make this my default address
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-full border border-stone-300 text-sm font-semibold text-stone-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-maroon-800 hover:bg-maroon-900 h-12 flex-1 rounded-full text-sm font-semibold text-white transition-colors"
          >
            Save address
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-stone-500">
        {label}
      </span>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={cn(
          "focus:border-maroon-600 focus:ring-maroon-600/15 h-11 w-full rounded-xl border bg-white px-3.5 text-sm transition-colors outline-none focus:ring-4",
          error ? "border-red-400" : "border-stone-300",
        )}
      />
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
