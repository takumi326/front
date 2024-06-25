"use client";
import React, { useState, createContext, ReactNode } from "react";

import { paymentData } from "@/interface/payment-interface";
import { incomeData } from "@/interface/income-interface";
import { accountData } from "@/interface/account-interface";
import { transferData } from "@/interface/transfer-interface";
import {
  classificationData,
  classificationMonthlyAmountData,
} from "@/interface/classification-interface";
import { categoryData } from "@/interface/category-interface";
import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

export const moneyContext = createContext<{
  repetitionMoneies: repetitionMoneyData[];
  setRepetitionMoneies: React.Dispatch<
    React.SetStateAction<repetitionMoneyData[]>
  >;
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
  calendarPayments: paymentData[];
  setCalendarPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  payments: paymentData[];
  setPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  allPayments: paymentData[];
  setAllPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  calendarIncomes: incomeData[];
  setCalendarIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  incomes: incomeData[];
  setIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  allIncomes: incomeData[];
  setAllIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  accounts: accountData[];
  setAccounts: React.Dispatch<React.SetStateAction<accountData[]>>;
  calendarTransfers: transferData[];
  setCalendarTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  transfers: transferData[];
  setTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  allTransfers: transferData[];
  setAllTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  filter: string;
  setFilter: React.Dispatch<
    React.SetStateAction<"payment" | "income" | "account">
  >;
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  repetitionMoneies: [],
  setRepetitionMoneies: () => {},
  classifications: [],
  setClassifications: () => {},
  classificationMonthlyAmounts: [],
  setClassificationMonthlyAmounts: () => {},
  categories: [],
  setCategories: () => {},
  calendarPayments: [],
  setCalendarPayments: () => {},
  payments: [],
  setPayments: () => {},
  allPayments: [],
  setAllPayments: () => {},
  calendarIncomes: [],
  setCalendarIncomes: () => {},
  allIncomes: [],
  setAllIncomes: () => {},
  incomes: [],
  setIncomes: () => {},
  accounts: [],
  setAccounts: () => {},
  calendarTransfers: [],
  setCalendarTransfers: () => {},
  transfers: [],
  setTransfers: () => {},
  allTransfers: [],
  setAllTransfers: () => {},
  filter: "payment",
  setFilter: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
  isEditing: false,
  setIsEditing: () => {},
  loading: false,
  setLoading: () => {},
});

interface MoneyProviderProps {
  children: ReactNode;
}

export const MoneyProvider: React.FC<MoneyProviderProps> = ({ children }) => {
  const [repetitionMoneies, setRepetitionMoneies] = useState<
    repetitionMoneyData[]
  >([]);
  const [classifications, setClassifications] = useState<classificationData[]>(
    []
  );
  const [classificationMonthlyAmounts, setClassificationMonthlyAmounts] =
    useState<classificationMonthlyAmountData[]>([]);
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [calendarPayments, setCalendarPayments] = useState<paymentData[]>([]);
  const [allPayments, setAllPayments] = useState<paymentData[]>([]);
  const [payments, setPayments] = useState<paymentData[]>([]);
  const [calendarIncomes, setCalendarIncomes] = useState<incomeData[]>([]);
  const [allIncomes, setAllIncomes] = useState<incomeData[]>([]);
  const [incomes, setIncomes] = useState<incomeData[]>([]);
  const [accounts, setAccounts] = useState<accountData[]>([]);
  const [calendarTransfers, setCalendarTransfers] = useState<transferData[]>(
    []
  );
  const [allTransfers, setAllTransfers] = useState<transferData[]>([]);
  const [transfers, setTransfers] = useState<transferData[]>([]);
  const [filter, setFilter] = useState<"payment" | "income" | "account">(
    "payment"
  );
  const [currentMonth, setCurrentMonth] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <moneyContext.Provider
      value={{
        repetitionMoneies,
        setRepetitionMoneies,
        classifications,
        setClassifications,
        classificationMonthlyAmounts,
        setClassificationMonthlyAmounts,
        categories,
        setCategories,
        calendarPayments,
        setCalendarPayments,
        allPayments,
        setAllPayments,
        payments,
        setPayments,
        calendarIncomes,
        setCalendarIncomes,
        allIncomes,
        setAllIncomes,
        incomes,
        setIncomes,
        accounts,
        setAccounts,
        calendarTransfers,
        setCalendarTransfers,
        allTransfers,
        setAllTransfers,
        transfers,
        setTransfers,
        filter,
        setFilter,
        currentMonth,
        setCurrentMonth,
        isEditing,
        setIsEditing,
        loading,
        setLoading,
      }}
    >
      {children}
    </moneyContext.Provider>
  );
};
