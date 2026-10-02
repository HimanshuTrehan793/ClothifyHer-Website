import { useEffect, useMemo, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  extractAddressFields,
  useResolveLocationQuery,
  useSearchPlacesQuery,
} from "@/features/maps/mapsApi";
import { getLocationPermission } from "@/utils/geolocation";
import type { SavedAddress } from "@/interfaces/user";

/** Hyderabad — orders ship from here, so it's the least-wrong cold start. */
const FALLBACK_CENTER = { lat: 17.4065, lng: 78.4772 };
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface AddressMapDialogProps {
  open: boolean;
  onClose: () => void;
  /** Hands the picked location back as address fields to prefill the form. */
  onConfirm: (prefill: Partial<SavedAddress>) => void;
  /** Abandon the map and type the address instead. */
  onSkip: () => void;
}

/**
 * Map picker: drag the map under a fixed centre pin, or search for a place.
 * The pin is a plain overlay rather than a map marker — the marker API needs a
 * cloud-configured Map ID, and a centre pin is the pattern people know from
 * every delivery app anyway.
 */
export function AddressMapDialog({
  open,
  onClose,
  onConfirm,
  onSkip,
}: AddressMapDialogProps) {
  const [center, setCenter] = useState(FALLBACK_CENTER);
  const [pin, setPin] = useState(FALLBACK_CENTER);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);

  // Debounced so dragging the map doesn't bill a lookup per frame.
  const [pinSettled, setPinSettled] = useState(FALLBACK_CENTER);
  useEffect(() => {
    const id = setTimeout(() => setPinSettled(pin), 600);
    return () => clearTimeout(id);
  }, [pin]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data: place, isFetching: resolving } = useResolveLocationQuery(
    pinSettled,
    { skip: !open },
  );
  const { data: suggestions = [], isFetching: searching } =
    useSearchPlacesQuery(debounced, { skip: !open || debounced.length < 3 });

  const fields = useMemo(() => extractAddressFields(place ?? null), [place]);

  // Reset between openings so a stale pin never carries into a new address.
  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebounced("");
      setLocationBlocked(false);
    }
  }, [open]);

  /* Already granted → centre on them straight away; nobody wants to drag from
     a default city. `prompt` is left alone so the browser only asks when they
     press the button themselves. */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void getLocationPermission().then((state) => {
      if (!cancelled && state === "granted") locateMe();
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(next);
        setPin(next);
        setLocating(false);
      },
      () => {
        /* Denied or unavailable. The map still works by dragging, but the
           customer asked for their location and didn't get it — so say so and
           offer the typed form. */
        setLocating(false);
        setLocationBlocked(true);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const pickSuggestion = (loc: { lat: number; lng: number }) => {
    setCenter(loc);
    setPin(loc);
    setSearch("");
    setDebounced("");
  };

  const confirm = () => {
    onConfirm({
      line2: fields.area || undefined,
      city: fields.city,
      state: fields.state,
      pincode: fields.pincode,
      lat: pin.lat,
      lng: pin.lng,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      {/* ── Search bar ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 px-3 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close map"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search area, street or landmark"
            className="focus:border-maroon-600 h-11 w-full rounded-xl border border-stone-300 bg-white pr-3 pl-9 text-sm outline-none"
          />
        </div>
      </div>

      {/* ── Map (or a clear reason it can't load) ───────────────────── */}
      <div className="relative min-h-0 flex-1">
        {!MAPS_KEY ? (
          <div className="grid h-full place-items-center px-8 text-center">
            <p className="text-sm text-stone-500">
              The map isn't configured yet. Close this and type your address
              instead — nothing is lost.
            </p>
          </div>
        ) : (
          <>
            <APIProvider apiKey={MAPS_KEY}>
              <Map
                center={center}
                defaultZoom={17}
                gestureHandling="greedy"
                disableDefaultUI
                onCameraChanged={(e) => {
                  setCenter(e.detail.center);
                  setPin(e.detail.center);
                }}
                className="h-full w-full"
              />
            </APIProvider>

            {/* Fixed centre pin — the map moves underneath it. */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <MapPin
                className="text-maroon-800 -mt-6 h-9 w-9 drop-shadow"
                strokeWidth={2.5}
              />
            </div>

            <button
              type="button"
              onClick={locateMe}
              className="text-maroon-800 absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold shadow-md"
            >
              <LocateFixed
                className={cn("h-4 w-4", locating && "animate-spin")}
              />
              Use my location
            </button>
          </>
        )}

        {/* Search results sit over the map, as in every delivery app. */}
        {debounced.length >= 3 && (
          <div className="absolute inset-x-0 top-0 max-h-72 overflow-y-auto border-b border-stone-200 bg-white shadow-lg">
            {searching && (
              <p className="px-4 py-3 text-sm text-stone-500">Searching…</p>
            )}
            {!searching && suggestions.length === 0 && (
              <p className="px-4 py-3 text-sm text-stone-500">
                No places found.
              </p>
            )}
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                type="button"
                onClick={() => pickSuggestion(s.geometry.location)}
                className="flex w-full items-start gap-3 border-b border-stone-100 px-4 py-3 text-left last:border-0 hover:bg-stone-50"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-stone-900">
                    {s.name}
                  </span>
                  <span className="block truncate text-xs text-stone-500">
                    {s.formatted_address}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm bar ─────────────────────────────────────────────── */}
      <div className="border-t border-stone-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
          Delivering to
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-stone-800">
          {resolving
            ? "Locating…"
            : (place?.formatted_address ??
              "Move the map to pick your location")}
        </p>
        {locationBlocked && (
          <p className="mt-2 text-xs text-stone-500">
            Location is turned off for this site. Drag the map, search above, or
            type your address instead.
          </p>
        )}

        <button
          type="button"
          onClick={confirm}
          disabled={!place}
          className="bg-maroon-800 hover:bg-maroon-900 mt-3 h-12 w-full rounded-full text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          Confirm location
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="text-maroon-700 mt-2 h-10 w-full text-sm font-medium"
        >
          Enter address manually
        </button>
      </div>
    </div>
  );
}
