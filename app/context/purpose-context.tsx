"use client";
import React, { useState, createContext } from "react";

import { purposeData } from "@/interface/purpose-interface";

export const purposeContext = createContext<{
  purposes: purposeData[];
  setPurposes: React.Dispatch<React.SetStateAction<purposeData[]>>;
}>({
  purposes: [],
  setPurposes: () => {},
});

export const PurposeProvider: React.FC = ({ children }) => {
  const [purposes, setPurposes] = useState<purposeData[]>([]);

  return (
    <purposeContext.Provider value={{ purposes, setPurposes }}>
      {children}
    </purposeContext.Provider>
  );
};
