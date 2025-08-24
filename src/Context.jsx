import { createContext, useEffect, useState } from "react";
import { getLocalStorage } from "./helpers/LocalStorage";

export const PnrContext = createContext();

export const PnrProvider = ({ children }) => {
  const [pnrs, setPnrs] = useState([]);

  return (
    <PnrContext.Provider value={{ pnrs, setPnrs }}>
      {children}
    </PnrContext.Provider>
  );
};
