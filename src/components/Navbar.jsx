import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

import { signInWithGoogle } from "../apis/firebase/index.js";
import { api } from "../apis/axios.js";
import {
  clearBrowserStorage,
  setLocalStorage,
} from "../helpers/LocalStorage.js";
import { getSavedPnr } from "../apis/pnrServices/index.js";
import { PnrContext } from "../Context.jsx";

const Navbar = () => {
  const { pnrs, setPnrs } = useContext(PnrContext);
  console.log("Navbar PNRs from Context:", pnrs);
  const [user, setUser] = useState(null); // store logged in user
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Auto check session on mount
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    try {
      // Step 1: Login with Google
      const backendUser = await signInWithGoogle();
      setUser(backendUser);

      // Step 2: Fetch saved PNRs
      const fetchSavedPnr = async () => {
        try {
          const savedPnrResponse = await getSavedPnr();
          console.log("Saved PNR response:", savedPnrResponse);
          return savedPnrResponse.data;
        } catch (error) {
          console.error("Error fetching saved PNRs:", error);
          return null;
        }
      };

      const data = await fetchSavedPnr();
      if (data && data.pnrs) {
        setLocalStorage(data.pnrs);
        setPnrs(data.pnrs);
      }

      // redirect to home after login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout").then(() => {
      setUser(null);
      console.log("Logged out successfully");
      clearBrowserStorage();
      window.location.reload();
    }); // clear cookie in backend
  };

  return (
    <>
      <header className="w-full bg-green-500 px-2 py-4">
        <nav className="mx-auto w-11/12 lg:max-w-6xl">
          <ol className="flex items-center justify-between">
            <li>
              <Link
                to="/"
                className="group text-2xl font-semibold text-white duration-300"
              >
                Confirm Berth
              </Link>
            </li>
            <li className="relative">
              {!user ? (
                <button
                  onClick={handleLogin}
                  className="rounded-lg border-2 border-white px-4 py-2 font-semibold text-white duration-300 hover:bg-white hover:text-black"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <p
                    className="flex items-center gap-2 text-white"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    <img
                      src={user?.picture}
                      alt="Profile"
                      className="h-9 w-9 cursor-pointer rounded-full border-2 border-white"
                    />
                    <span className="font-medium md:hidden">
                      {user.name?.split(" ")[0]}
                    </span>
                    <span className="hidden font-medium md:block">
                      {user.name}
                    </span>
                  </p>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 top-8 mt-2 rounded-lg bg-white shadow-lg hover:bg-slate-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-5 py-3 text-left text-gray-700"
                      >
                        <IoIosLogOut size={20} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
            <li className="relative">
              {!user ? (
                <button
                  onClick={handleLogin}
                  className="rounded-lg border-2 border-white px-4 py-2 font-semibold text-white duration-300 hover:bg-white hover:text-black"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <p
                    className="flex items-center gap-2 text-white"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    <img
                      src={user?.picture}
                      alt="Profile"
                      className="h-9 w-9 cursor-pointer rounded-full border-2 border-white"
                    />
                    <span className="font-medium md:hidden">
                      {user.name?.split(" ")[0]}
                    </span>
                    <span className="hidden font-medium md:block">
                      {user.name}
                    </span>
                  </p>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 top-8 mt-2 rounded-lg bg-white shadow-lg hover:bg-slate-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-5 py-3 text-left text-gray-700"
                      >
                        <IoIosLogOut size={20} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ol>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
