"use client";
import React, { useState, createContext,ReactNode } from "react";

import { purposeData } from "@/interface/purpose-interface";

export const purposeContext = createContext<{
  purposes: purposeData[];
  setPurposes: React.Dispatch<React.SetStateAction<purposeData[]>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  purposes: [],
  setPurposes: () => {},
  isEditing: false,
  setIsEditing: () => {},
});

interface PurposeProviderProps {
  children: ReactNode;
}

export const PurposeProvider: React.FC<PurposeProviderProps> = ({ children }) => {
  const [purposes, setPurposes] = useState<purposeData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <purposeContext.Provider
      value={{ purposes, setPurposes, isEditing, setIsEditing }}
    >
      {children}
    </purposeContext.Provider>
  );
};
