import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <header className="bg-green-500 w-full px-2 py-4">
        <nav className="container">
          <ol>
            <li>
              <Link
                to="/"
                className="text-2xl group hover:text-white font-semibold duration-300"
              >
                Confirm Berth
              </Link>
            </li>
          </ol>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
