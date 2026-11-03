import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import { PnrProvider, usePnr } from "./store/PnrStore";

const App = () => {
  const { theme } = usePnr();
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        transition={Slide}
        theme={theme}
        toastClassName="!rounded-lg !font-sans !text-sm !font-medium"
      />
      <Analytics />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [{ index: true, element: <Home /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PnrProvider>
      <RouterProvider router={router} />
    </PnrProvider>
  </React.StrictMode>,
);
