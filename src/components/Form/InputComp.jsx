import React from "react";

const Input = ({ pnr, handelOnChange, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="pnr" className="text-lg font-medium">
        Enter PNR number
      </label>
      <div className="flex justify-between gap-x-4">
        <input
          type="number"
          name="pnr"
          id="pnr"
          value={pnr}
          onChange={handelOnChange}
          placeholder="Enter PNR number"
          className="p-2 rounded w-full"
        />
        {children}
      </div>
    </div>
  );
};

export default Input;
