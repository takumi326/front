"use client";
import React, { useState, createContext } from "react";

export const headerContext = createContext<{
  setting: string;
  setSetting: React.Dispatch<React.SetStateAction<string>>;
}>({
  setting: "TOP",
  setSetting: () => {},
});

export const HeaderProvider: React.FC = ({ children }) => {
  const [setting, setSetting] = useState("TOP");

  return (
    <headerContext.Provider value={{ setting, setSetting }}>
      {children}
    </headerContext.Provider>
  );
};
