"use client";
import React, { useState, createContext,useEffect } from "react";

import { paymentData } from "@/interface/payment-interface";
import { incomeData } from "@/interface/income-interface";
import { accountData } from "@/interface/account-interface";
import { transferData } from "@/interface/transfer-interface";
import {
  classificationData,
  classificationMonthlyAmountData,
} from "@/interface/classification-interface";
import { categoryData } from "@/interface/category-interface";

import { paymentGetData } from "@/lib/api/payment-api";
import { incomeGetData} from "@/lib/api/income-api";
import { accountGetData } from "@/lib/api/account-api";
import { transferGetData} from "@/lib/api/transfer-api";
import { categoryGetData } from "@/lib/api/category-api";
import { classificationGetData } from "@/lib/api/classification-api";
import { classificationMonthlyAmountGetData } from "@/lib/api/classificationMonthlyAmount-api";

export const moneyContext = createContext<{
  classifications: classificationData[];
  setClassifications: React.Dispatch<
    React.SetStateAction<classificationData[]>
  >;
  classificationMonthlyAmounts: classificationMonthlyAmountData[];
  setClassificationMonthlyAmounts: React.Dispatch<
    React.SetStateAction<classificationMonthlyAmountData[]>
  >;
  categories: categoryData[];
  setCategories: React.Dispatch<React.SetStateAction<categoryData[]>>;
  allPayments: paymentData[];
  setAllPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  payments: paymentData[];
  setPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  allIncomes: incomeData[];
  setAllIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  incomes: incomeData[];
  setIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  accounts: accountData[];
  setAccounts: React.Dispatch<React.SetStateAction<accountData[]>>;
  allTransfers: transferData[];
  setAllTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  transfers: transferData[];
  setTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  filter: string;
  setFilter: React.Dispatch<
    React.SetStateAction<"payment" | "income" | "account">
  >;
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
}>({
  classifications: [],
  setClassifications: () => {},
  classificationMonthlyAmounts: [],
  setClassificationMonthlyAmounts: () => {},
  categories: [],
  setCategories: () => {},
  allPayments: [],
  setAllPayments: () => {},
  payments: [],
  setPayments: () => {},
  allIncomes: [],
  setAllIncomes: () => {},
  incomes: [],
  setIncomes: () => {},
  accounts: [],
  setAccounts: () => {},
  allTransfers: [],
  setAllTransfers: () => {},
  transfers: [],
  setTransfers: () => {},
  filter: "payment",
  setFilter: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
});

export const MoneyProvider: React.FC = ({ children }) => {　
  
  const [classifications, setClassifications] = useState<classificationData[]>(
    []
  );
  const [classificationMonthlyAmounts, setClassificationMonthlyAmounts] =
    useState<classificationMonthlyAmountData[]>([]);
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [allPayments, setAllPayments] = useState<paymentData[]>([]);
  const [payments, setPayments] = useState<paymentData[]>([]);
  const [allIncomes, setAllIncomes] = useState<incomeData[]>([]);
  const [incomes, setIncomes] = useState<incomeData[]>([]);
  const [accounts, setAccounts] = useState<accountData[]>([]);
  const [allTransfers, setAllTransfers] = useState<transferData[]>([]);
  const [transfers, setTransfers] = useState<transferData[]>([]);
  const [filter, setFilter] = useState<"payment" | "income" | "account">(
    "payment"
  );
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    paymentGetData().then((data) => {
      setAllPayments(data);
    });
    paymentGetData().then((data) => {
      setPayments(data);
    });
    incomeGetData().then((data) => {
      setAllIncomes(data);
    });
    incomeGetData().then((data) => {
      setIncomes(data);
    });
    accountGetData().then((data) => {
      setAccounts(data);
    });
    categoryGetData().then((data) => {
      setCategories(data);
    });
    classificationGetData().then((data) => {
      setClassifications(data);
    });
    classificationMonthlyAmountGetData().then((data) => {
      setClassificationMonthlyAmounts(data);
    });
    transferGetData().then((data) => {
      setAllTransfers(data);
    });
    transferGetData().then((data) => {
      setTransfers(data);
    });
  }, []);

  return (
    <moneyContext.Provider
      value={{
        classifications,
        setClassifications,
        classificationMonthlyAmounts,
        setClassificationMonthlyAmounts,
        categories,
        setCategories,
        allPayments,
        setAllPayments,
        payments,
        setPayments,
        allIncomes,
        setAllIncomes,
        incomes,
        setIncomes,
        accounts,
        setAccounts,
        allTransfers,
        setAllTransfers,
        transfers,
        setTransfers,
        filter,
        setFilter,
        currentMonth,
        setCurrentMonth,
      }}
    >
      {children}
    </moneyContext.Provider>
  );
};
