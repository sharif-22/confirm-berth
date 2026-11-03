import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { authApi, pnrApi, toApiError } from "../apis/client.js";
import { signInWithGoogle, firebaseSignOut } from "../apis/firebase/index.js";
import { storage } from "../lib/storage.js";

const PnrContext = createContext(null);

export const usePnr = () => {
  const ctx = useContext(PnrContext);
  if (!ctx) throw new Error("usePnr must be used inside <PnrProvider>");
  return ctx;
};

const upsert = (list, trip) => {
  const i = list.findIndex((t) => t.pnrNumber === trip.pnrNumber);
  if (i === -1) return [trip, ...list];
  const next = [...list];
  next[i] = { ...next[i], ...trip };
  return next;
};

/**
 * Single source of truth for user, trips and quota.
 * Guests: trips live in localStorage on this device.
 * Logged in: trips live on the server (cached locally for instant paint).
 */
export function PnrProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [trips, setTrips] = useState(() => storage.guestTrips());
  const [quota, setQuota] = useState(null);
  const [busy, setBusy] = useState({}); // { [pnr]: true } while a lookup runs
  const [limitHit, setLimitHit] = useState(null); // quota object when user ran out
  const [authBusy, setAuthBusy] = useState(false);
  const [userTheme, setUserTheme] = useState("light");
  const userRef = useRef(user);
  userRef.current = user;

  // Theme: guests always see the light theme; a logged-in user's choice is remembered per account.
  useEffect(() => {
    setUserTheme(user ? storage.theme(user.uid) : "light");
  }, [user]);

  const theme = user ? userTheme : "light";

  useEffect(() => {
    const dark = theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#09090b" : "#ffffff");
  }, [theme]);

  const setTheme = useCallback((next) => {
    const uid = userRef.current?.uid;
    if (!uid) return;
    setUserTheme(next);
    storage.setTheme(uid, next);
  }, []);

  // Persist trips to the right place whenever they change.
  useEffect(() => {
    if (user === undefined) return;
    if (user) storage.setUserTrips(user.uid, trips);
    else storage.setGuestTrips(trips);
  }, [trips, user]);

  const refreshQuota = useCallback(async () => {
    try {
      setQuota(await pnrApi.quota());
    } catch {
      /* non-critical */
    }
  }, []);

  // Pull the account's trips, first uploading anything saved on this device as a guest.
  const syncAccountTrips = useCallback(async (u) => {
    setTrips(storage.userTrips(u.uid));
    const local = storage.guestTrips();
    try {
      const serverTrips = local.length
        ? await pnrApi.importTrips(local)
        : await pnrApi.saved();
      if (local.length) storage.clearGuestTrips();
      setTrips(serverTrips);
      return local.length;
    } catch (e) {
      toast.error(toApiError(e).message);
      return 0;
    }
  }, []);

  // Restore the session on load.
  useEffect(() => {
    (async () => {
      let u = null;
      try {
        u = await authApi.me();
      } catch {
        u = null;
      }
      setUser(u);
      if (u) await syncAccountTrips(u);
      refreshQuota();
    })();
  }, [syncAccountTrips, refreshQuota]);

  const lookup = useCallback(async (pnr, { refresh = false } = {}) => {
    setBusy((b) => ({ ...b, [pnr]: true }));
    try {
      const res = await pnrApi.lookup(pnr, { refresh });
      setTrips((list) => upsert(list, res.data));
      if (res.quota) setQuota(res.quota);
      return { ok: true, trip: res.data, fromCache: res.fromCache };
    } catch (e) {
      const err = toApiError(e);
      if (err.quota) setQuota(err.quota);
      if (err.reason === "QUOTA") setLimitHit(err.quota || { remaining: 0 });
      else toast.error(err.message);
      return { ok: false, error: err };
    } finally {
      setBusy((b) => {
        const next = { ...b };
        delete next[pnr];
        return next;
      });
    }
  }, []);

  const removeTrip = useCallback(
    async (pnr) => {
      const before = trips;
      setTrips((list) => list.filter((t) => t.pnrNumber !== pnr));
      if (!userRef.current) return true;
      try {
        await pnrApi.remove(pnr);
        return true;
      } catch (e) {
        setTrips(before);
        toast.error(toApiError(e).message);
        return false;
      }
    },
    [trips],
  );

  const login = useCallback(async () => {
    setAuthBusy(true);
    try {
      const u = await signInWithGoogle();
      if (!u) return false; // popup closed
      setUser(u);
      setLimitHit(null);
      const moved = await syncAccountTrips(u);
      await refreshQuota();
      toast.success(
        moved
          ? `Welcome, ${u.name?.split(" ")[0] || "traveller"}! ${moved} trip${moved > 1 ? "s" : ""} synced to your account.`
          : `Welcome, ${u.name?.split(" ")[0] || "traveller"}!`,
      );
      return true;
    } catch (e) {
      toast.error(
        e?.response
          ? toApiError(e).message
          : "Google sign-in failed. Please try again.",
      );
      return false;
    } finally {
      setAuthBusy(false);
    }
  }, [syncAccountTrips, refreshQuota]);

  const logout = useCallback(async () => {
    const uid = userRef.current?.uid;
    try {
      await authApi.logout();
    } catch {
      /* clear locally anyway */
    }
    await firebaseSignOut();
    if (uid) storage.clearUserTrips(uid);
    setUser(null);
    setTrips(storage.guestTrips());
    refreshQuota();
    toast.info("You've been logged out.");
  }, [refreshQuota]);

  const value = useMemo(
    () => ({
      user,
      trips,
      quota,
      busy,
      authBusy,
      limitHit,
      theme,
      setTheme,
      dismissLimit: () => setLimitHit(null),
      lookup,
      removeTrip,
      login,
      logout,
    }),
    [
      user,
      trips,
      quota,
      busy,
      authBusy,
      limitHit,
      theme,
      setTheme,
      lookup,
      removeTrip,
      login,
      logout,
    ],
  );

  return <PnrContext.Provider value={value}>{children}</PnrContext.Provider>;
}
