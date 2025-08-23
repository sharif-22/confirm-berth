import React from "react";

const PlaceholderCard = ({ placeholderTxt }) => {
  return (
    <div className="mx-auto my-5 min-w-80 space-y-4 p-5">
      <img className="mx-auto" src="/loading.gif" alt="loading gif" />
      <h1 className="text-center text-xl font-medium">{placeholderTxt}</h1>
    </div>
  );
};

export default PlaceholderCard;
