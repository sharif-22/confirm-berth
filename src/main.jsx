import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import "./index.css";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/trips",
        element: <Trips />,
      },
      {
        path: "/trips/:pnr",
        element: <Trip />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={route} />);
