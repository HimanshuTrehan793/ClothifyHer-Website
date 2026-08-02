import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import {
  ChevronRight,
  Heart,
  LogOut,
  Lock,
  MapPin,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddressDialog } from "@/components/dialog/AddressDialog";
import { SiteFooter } from "@/components/common/SiteFooter";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  logout,
  openLogin,
  selectIsAuthenticated,
  selectPhoneNumber,
} from "@/features/auth/authSlice";
import {
  addAddress,
  removeAddress,
  selectAddresses,
  selectProfile,
  setDefaultAddress,
  updateAddress,
  updateProfile,
} from "@/features/user/userSlice";
import { selectWishlistCount } from "@/features/wishlist/wishlistSlice";
import type { Gender, SavedAddress } from "@/interfaces/user";

const GENDERS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "unspecified", label: "Prefer not to say" },
];

export default function Profile() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const profile = useAppSelector(selectProfile);
  const addresses = useAppSelector(selectAddresses);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const wishCount = useAppSelector(selectWishlistCount);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<SavedAddress | null>(null);

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Your Profile — ClothifyHer</title>
        </Helmet>
        <div className="mx-auto flex max-w-sm flex-col items-center px-6 py-20 text-center">
          <span className="bg-maroon-50 grid h-20 w-20 place-items-center rounded-full">
            <Lock className="text-maroon-700 h-8 w-8" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-stone-900">
            Sign in to view your profile
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            We'll send a one-time code to your mobile number — no password
            needed.
          </p>
          <button
            type="button"
            onClick={() => dispatch(openLogin("account"))}
            className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
          >
            Sign in
          </button>
        </div>
        <SiteFooter />
      </>
    );
  }

  const initials =
    profile.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CH";

  const saveProfile = () => {
    dispatch(updateProfile(draft));
    setEditing(false);
  };

  const openAdd = () => {
    setEditAddress(null);
    setDialogOpen(true);
  };

  const openEdit = (address: SavedAddress) => {
    setEditAddress(address);
    setDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Your Profile — ClothifyHer</title>
        {/* Account pages are private. */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10">
        {/* ── Identity ─────────────────────────────────────────────── */}
        <header className="flex items-center gap-4">
          <span className="bg-maroon-800 text-cream-100 grid h-16 w-16 shrink-0 place-items-center rounded-full font-serif text-xl">
            {initials}
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl text-stone-900 sm:text-3xl">
              {profile.fullName || "Your Profile"}
            </h1>
            <p className="mt-0.5 truncate text-sm text-stone-500">
              +91 {phoneNumber ?? profile.phoneNumber}
              {profile.email && ` · ${profile.email}`}
            </p>
          </div>

          {/* Sits with the identity it acts on. Label collapses on mobile so
              it never squeezes the name. */}
          <button
            type="button"
            onClick={() => dispatch(logout())}
            aria-label="Sign out"
            className="ml-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-3 text-sm font-semibold text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>

        {/* ── Quick links ──────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <QuickLink
            to="/orders"
            icon={Package}
            label="Your Orders"
            hint="Track & return"
          />
          <QuickLink
            to="/wishlist"
            icon={Heart}
            label="Favourites"
            hint={`${wishCount} saved`}
          />
        </div>

        {/* ── Personal details ─────────────────────────────────────── */}
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-800">
              Personal Details
            </h2>
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                className="text-maroon-700 hover:text-maroon-900 inline-flex items-center gap-1.5 text-sm font-medium"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="mt-5 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={draft.fullName}
                  onChange={(v) => setDraft({ ...draft, fullName: v })}
                />
                <Field
                  label="Email"
                  type="email"
                  value={draft.email}
                  onChange={(v) => setDraft({ ...draft, email: v })}
                />
                <Field
                  label="Date of birth"
                  type="date"
                  value={draft.dateOfBirth}
                  onChange={(v) => setDraft({ ...draft, dateOfBirth: v })}
                />
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-stone-500">
                    Gender
                  </span>
                  <select
                    value={draft.gender}
                    onChange={(e) =>
                      setDraft({ ...draft, gender: e.target.value as Gender })
                    }
                    className="focus:border-maroon-600 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none"
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Phone is the login identity — changing it is a re-verify flow. */}
              <p className="text-xs text-stone-400">
                Mobile number is used to sign in and can't be changed here.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-11 flex-1 rounded-full border border-stone-300 text-sm font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-maroon-800 hover:bg-maroon-900 h-11 flex-1 rounded-full text-sm font-semibold text-white transition-colors"
                >
                  Save changes
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-4 grid grid-cols-2 gap-y-4 text-sm">
              <Detail label="Full name" value={profile.fullName} />
              <Detail label="Email" value={profile.email} />
              <Detail
                label="Mobile"
                value={`+91 ${phoneNumber ?? profile.phoneNumber}`}
              />
              <Detail
                label="Gender"
                value={
                  GENDERS.find((g) => g.value === profile.gender)?.label ?? "—"
                }
              />
              <Detail
                label="Date of birth"
                value={
                  profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "—"
                }
              />
            </dl>
          )}
        </section>

        {/* ── Addresses ────────────────────────────────────────────── */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-800">
              Saved Addresses
            </h2>
            <button
              type="button"
              onClick={openAdd}
              className="text-maroon-700 hover:text-maroon-900 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add new
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center">
              <MapPin className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-3 text-sm text-stone-500">
                No addresses saved yet.
              </p>
              <button
                type="button"
                onClick={openAdd}
                className="bg-maroon-800 mt-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className={cn(
                    "rounded-2xl border bg-white p-4",
                    address.isDefault
                      ? "border-maroon-300 ring-maroon-100 ring-2"
                      : "border-stone-200",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-stone-600 uppercase">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="bg-maroon-50 text-maroon-800 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold text-stone-900">
                    {address.name}
                  </p>
                  <address className="mt-1 text-sm leading-relaxed text-stone-600 not-italic">
                    {address.line1}
                    {address.line2 && (
                      <>
                        <br />
                        {address.line2}
                      </>
                    )}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                    <br />
                    +91 {address.phone}
                  </address>

                  <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => openEdit(address)}
                      className="text-maroon-700 hover:text-maroon-900 inline-flex items-center gap-1"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(removeAddress(address.id))}
                      className="inline-flex items-center gap-1 text-stone-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => dispatch(setDefaultAddress(address.id))}
                        className="ml-auto text-stone-500 hover:text-stone-800"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <SiteFooter />

      <AddressDialog
        open={dialogOpen}
        address={editAddress}
        onClose={() => setDialogOpen(false)}
        onSave={(address) => {
          dispatch(editAddress ? updateAddress(address) : addAddress(address));
          setDialogOpen(false);
        }}
      />
    </>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: string;
  icon: typeof Package;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="hover:border-maroon-300 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-colors"
    >
      <span className="bg-maroon-50 text-maroon-700 grid h-10 w-10 shrink-0 place-items-center rounded-full">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-stone-900">
          {label}
        </span>
        <span className="block text-xs text-stone-500">{hint}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-stone-300" />
    </Link>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-stone-800">{value || "—"}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-stone-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:border-maroon-600 focus:ring-maroon-600/15 h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-sm transition-colors outline-none focus:ring-4"
      />
    </label>
  );
}
