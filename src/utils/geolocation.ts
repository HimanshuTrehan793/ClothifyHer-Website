export type LocationPermission =
  "granted" | "prompt" | "denied" | "unsupported";

/**
 * Reads the geolocation permission without prompting for it.
 *
 * `unsupported` covers browsers without the Permissions API (older Safari) as
 * well as those without geolocation at all — callers should treat it as "we
 * don't know", not as denied, since the map still works by dragging.
 */
export async function getLocationPermission(): Promise<LocationPermission> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return "unsupported";
  }
  if (!navigator.permissions?.query) return "unsupported";
  try {
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state as LocationPermission;
  } catch {
    return "unsupported";
  }
}
