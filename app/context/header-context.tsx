"use client";
import React, { useState, createContext, ReactNode } from "react";

export const headerContext = createContext<{
  setting: string;
  setSetting: React.Dispatch<React.SetStateAction<string>>;
}>({
  setting: "TOP",
  setSetting: () => {},
});

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider: React.FC< HeaderProviderProps>= ({ children }) => {
  const [setting, setSetting] = useState("TOP");

  return (
    <headerContext.Provider value={{ setting, setSetting }}>
      {children}
    </headerContext.Provider>
  );
};
