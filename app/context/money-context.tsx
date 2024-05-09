"use client";
import React, { useState, createContext } from "react";

import { paymentData } from "@/interface/payment-interface";
import { incomeData } from "@/interface/income-interface";
import { accountData } from "@/interface/account-interface";
import { transferData } from "@/interface/transfer-interface";
import { classificationData } from "@/interface/classification-interface";
import { categoryData } from "@/interface/category-interface";

export const moneyContext = createContext<{
  classifications: classificationData[];
  setClassifications: React.Dispatch<
    React.SetStateAction<classificationData[]>
  >;
  categories: categoryData[];
  setCategories: React.Dispatch<React.SetStateAction<categoryData[]>>;
  payments: paymentData[];
  setPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  incomes: incomeData[];
  setIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  accounts: accountData[];
  setAccounts: React.Dispatch<React.SetStateAction<accountData[]>>;
  transfers: transferData[];
  setTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
}>({
  classifications: [],
  setClassifications: () => {},
  categories: [],
  setCategories: () => {},
  payments: [],
  setPayments: () => {},
  incomes: [],
  setIncomes: () => {},
  accounts: [],
  setAccounts: () => {},
  transfers: [],
  setTransfers: () => {},
});

export const MoneyProvider: React.FC = ({ children }) => {
  const [classifications, setClassifications] = useState<classificationData[]>(
    []
  );
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [payments, setPayments] = useState<paymentData[]>([]);
  const [incomes, setIncomes] = useState<incomeData[]>([]);
  const [accounts, setAccounts] = useState<accountData[]>([]);
  const [transfers, setTransfers] = useState<transferData[]>([]);

  return (
    <moneyContext.Provider
      value={{
        classifications,
        setClassifications,
        categories,
        setCategories,
        payments,
        setPayments,
        incomes,
        setIncomes,
        accounts,
        setAccounts,
        transfers,
        setTransfers,
      }}
    >
      {children}
    </moneyContext.Provider>
  );
};
