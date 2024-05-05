import React from "react";

const PlaceholderCard = ({ placeholderTxt }) => {
  return (
    <div className="min-w-80  p-5 space-y-4 mx-auto my-5">
      <img className="mx-auto" src="/loading.gif" alt="loading gif" />
      <h1 className="text-xl font-medium text-center">{placeholderTxt}</h1>
    </div>
  );
};

export default PlaceholderCard;
