// Safe localStorage helpers (private mode / blocked storage must not crash the app).
const GUEST_KEY = "cb:guest-trips";
const LEGACY_KEY = "pnrData";
const userKey = (uid) => `cb:user-trips:${uid}`;
const themeKey = (uid) => `cb:theme:${uid}`;

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : null;
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storage = {
  // Guest trips, migrating the old "pnrData" key once.
  guestTrips() {
    const current = read(GUEST_KEY);
    if (current) return current;
    const legacy = read(LEGACY_KEY);
    if (legacy) {
      write(GUEST_KEY, legacy);
      remove(LEGACY_KEY);
      return legacy;
    }
    return [];
  },
  setGuestTrips: (trips) => write(GUEST_KEY, trips),
  clearGuestTrips: () => remove(GUEST_KEY),
  userTrips: (uid) => read(userKey(uid)) || [],
  setUserTrips: (uid, trips) => write(userKey(uid), trips),
  clearUserTrips: (uid) => remove(userKey(uid)),
  // theme is a per-account choice; guests always get the light theme
  theme(uid) {
    try {
      return localStorage.getItem(themeKey(uid)) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  },
  setTheme(uid, theme) {
    try {
      localStorage.setItem(themeKey(uid), theme);
    } catch {
      /* ignore */
    }
  },
};
