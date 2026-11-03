import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_PNR_API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: { "Cache-Control": "no-cache" },
});

/** Turn any axios error into something the UI can show. */
export function toApiError(err) {
  const res = err?.response;
  if (!res) {
    return {
      status: 0,
      reason: "NETWORK",
      message: navigator.onLine
        ? "Can't reach the server. Please try again."
        : "You're offline. Check your connection and try again.",
    };
  }
  return {
    status: res.status,
    reason: res.data?.reason,
    quota: res.data?.quota,
    message: res.data?.message || "Something went wrong. Please try again.",
  };
}

export const pnrApi = {
  lookup: (pnr, { refresh = false } = {}) =>
    api.get(`/pnrstatus/${pnr}`, { params: refresh ? { refresh: 1 } : {} }).then((r) => r.data),
  quota: () => api.get("/quota").then((r) => r.data.data),
  saved: () => api.get("/savedpnr").then((r) => r.data.data.pnrs),
  importTrips: (pnrs) => api.post("/savedpnr/import", { pnrs }).then((r) => r.data.data.pnrs),
  remove: (pnr) => api.delete(`/savedpnr/${pnr}`),
};

export const authApi = {
  me: () => api.get("/auth/me").then((r) => r.data.user),
  exchange: (idToken) =>
    api.post("/auth/google", {}, { headers: { Authorization: `Bearer ${idToken}` } }).then((r) => r.data.user),
  logout: () => api.post("/auth/logout"),
};
