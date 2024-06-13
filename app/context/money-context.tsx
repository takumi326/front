"use client";
import React, { useState, createContext, useEffect } from "react";

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

// import { paymentGetData } from "@/lib/api/payment-api";
// import { incomeGetData} from "@/lib/api/income-api";
// import { accountGetData } from "@/lib/api/account-api";
// import { transferGetData} from "@/lib/api/transfer-api";
// import { categoryGetData } from "@/lib/api/category-api";
// import { classificationGetData } from "@/lib/api/classification-api";
// import { classificationMonthlyAmountGetData } from "@/lib/api/classificationMonthlyAmount-api";

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
  // displayPayments: paymentData[];
  // setDisplayPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  // calendarPayments: paymentData[];
  // setCalendarPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  calendarPayments: paymentData[];
  setCalendarPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  payments: paymentData[];
  setPayments: React.Dispatch<React.SetStateAction<paymentData[]>>;
  // displayIncomes: incomeData[];
  // setDisplayIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  // calendarIncomes: incomeData[];
  // setCalendarIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  calendarIncomes: incomeData[];
  setCalendarIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  incomes: incomeData[];
  setIncomes: React.Dispatch<React.SetStateAction<incomeData[]>>;
  accounts: accountData[];
  setAccounts: React.Dispatch<React.SetStateAction<accountData[]>>;
  calendarTransfers: transferData[];
  setCalendarTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
  transfers: transferData[];
  setTransfers: React.Dispatch<React.SetStateAction<transferData[]>>;
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
  // displayPayments: [],
  // setDisplayPayments: () => {},
  // calendarPayments: [],
  // setCalendarPayments: () => {},
  calendarPayments: [],
  setCalendarPayments: () => {},
  payments: [],
  setPayments: () => {},
  // displayIncomes: [],
  // setDisplayIncomes: () => {},
  // calendarIncomes: [],
  // setCalendarIncomes: () => {},
  calendarIncomes: [],
  setCalendarIncomes: () => {},
  incomes: [],
  setIncomes: () => {},
  accounts: [],
  setAccounts: () => {},
  calendarTransfers: [],
  setCalendarTransfers: () => {},
  transfers: [],
  setTransfers: () => {},
  filter: "payment",
  setFilter: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
  isEditing: false,
  setIsEditing: () => {},
  loading: false,
  setLoading: () => {},
});

export const MoneyProvider: React.FC = ({ children }) => {
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
  const [payments, setPayments] = useState<paymentData[]>([]);
  const [calendarIncomes, setCalendarIncomes] = useState<incomeData[]>([]);
  const [incomes, setIncomes] = useState<incomeData[]>([]);
  const [accounts, setAccounts] = useState<accountData[]>([]);
  const [calendarTransfers, setCalendarTransfers] = useState<transferData[]>(
    []
  );
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
        payments,
        setPayments,
        calendarIncomes,
        setCalendarIncomes,
        incomes,
        setIncomes,
        accounts,
        setAccounts,
        calendarTransfers,
        setCalendarTransfers,
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
