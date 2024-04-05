import React from "react";

const Footer = () => {
  return (
    <div className="mt-auto bg-green-500">
      <footer className="text-white container py-3 flex flex-col md:flex-row justify-between text-xs">
        <p className="px-3">
          Made with ❤ by
          <a
            className="hover:text-black hover:underline mx-1"
            href="https://github.com/sharif-22"
            target="_blank"
          >
            Sharif
          </a>
          checkout
          <a
            className="hover:text-black hover:underline mx-1"
            href="https://github.com/sharif-22/confirm-berth"
            target="_blank"
          >
            Confirm Berth
          </a>
          for contribution
        </p>
        <p className="px-3">
          Copyright {new Date().getFullYear()} - All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Footer;
