import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="w-fit mx-auto flex flex-col m-10 h-screen p-8 gap-6">
      <h1 className="text-8xl flex gap-1">
        <span>4</span> <img src="/notFound.gif" alt="" srcset="" />
        <span className="ml-4">4</span>
      </h1>
      Seems like you're lost track. Don't worry, we can help you find your way
      back.
      <Link
        to="/"
        className="bg-green-500 p-2 px-6 font-semibold text-lg text-white hover:bg-green-600 rounded w-fit"
      >
        Back to Station
      </Link>
    </div>
  );
};

export default PageNotFound;
