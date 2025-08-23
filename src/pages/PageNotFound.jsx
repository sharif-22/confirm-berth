import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="m-10 mx-auto flex h-screen w-fit flex-col gap-6 p-8">
      <h1 className="flex gap-1 text-8xl">
        <span>4</span> <img src="/notFound.gif" alt="" srcset="" />
        <span className="ml-4">4</span>
      </h1>
      Seems like you're lost track. Don't worry, we can help you find your way
      back.
      <Link
        to="/"
        className="w-fit rounded bg-green-500 p-2 px-6 text-lg font-semibold text-white hover:bg-green-600"
      >
        Back to Station
      </Link>
    </div>
  );
};

export default PageNotFound;
