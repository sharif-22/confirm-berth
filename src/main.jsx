import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";

import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import "./index.css";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import { PnrProvider } from "./Context";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Analytics />
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
    ],
    errorElement: <PageNotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <PnrProvider>
    <RouterProvider router={route} />
  </PnrProvider>,
);
