"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  TableContainer,
  TableCell,
  TableRow,
  Stack,
  Paper,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  MenuItem,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { PieChart, Pie } from "recharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarApi, EventClickArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { classificationDelete } from "@/lib/api/classification-api";

import { PaymentShow } from "@/components/money/payment/show";
import { IncomeShow } from "@/components/money/income/show";
import { TransferShow } from "@/components/money/transfer/show";
import { ClassificationShow } from "@/components/money/classification/show";

import { paymentData } from "@/interface/payment-interface";
import { incomeData } from "@/interface/income-interface";
import { classificationData } from "@/interface/classification-interface";
// import { accountData } from "@/interface/account-interface";
import { transferData } from "@/interface/transfer-interface";

export const MoneyGraph = (): JSX.Element => {
  const {
    classifications,
    classificationMonthlyAmounts,
    accounts,
    allPayments,
    payments,
    calendarPayments,
    allIncomes,
    incomes,
    calendarIncomes,
    allTransfers,
    transfers,
    categories,
    calendarTransfers,
    filter,
    setCurrentMonth,
    setLoading,
    setIsEditing,
  } = useContext(moneyContext);
  const [paymentSettingTime, setPaymentSettingTime] = useState<
    "month" | "year" | "all"
  >("month");
  const [paymentSettingData, setPaymentSettingData] = useState<
    { name: string; value: number }[]
  >([]);

  const [incometSettingTime, setIncomeSettingTime] = useState<
    "month" | "year" | "all"
  >("month");
  const [incomeSettingData, setIncomeSettingData] = useState<
    { name: string; value: number }[]
  >([]);

  type LabelProps = {
    name: string;
    value: string;
    cx: number;
    x: number;
    y: number;
  };

  useEffect(() => {
    let settingDatas: { name: string; value: number }[] = [];
    if (paymentSettingTime === "month") {
      settingDatas = categories.map((category) => {
        const matchingPayment = allPayments.find(
          (payment) =>
            payment.category_id === category.id && payment.repetition === false
        );
        const value = matchingPayment ? matchingPayment.amount : 0;
        return {
          name: category.name,
          value: value,
        };
      });
    } else if (paymentSettingTime === "year") {
    } else {
    }
    setPaymentSettingData(settingDatas);
  }, [paymentSettingTime]);

  const handlePaymentTimeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as "month" | "year" | "all";
    setPaymentSettingTime(value);
  };

  const handleIncomeTimeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as "month" | "year" | "all";
    setIncomeSettingTime(value);
  };

  const paymentData = [
    { name: "Category 1", value: 400 },
    { name: "Category 2", value: 300 },
    { name: "Category 3", value: 300 },
    { name: "Category 4", value: 200 },
  ];
  // allPayments.map((payment) => ({name:categories.filter((category)=>category.id===)}));

  //     ? calendarPayments.map((payment) => ({
  //         paymentId: payment.id,
  //         title: payment.category_name,
  //         start: payment.schedule,
  //         allDay: true,
  //         backgroundColor: "green",
  //         borderColor: "green",
  //       }))

  const incomeData = [
    { name: "Category 1", value: 400 },
    { name: "Category 2", value: 300 },
    { name: "Category 3", value: 300 },
    { name: "Category 4", value: 200 },
  ];

  const label: React.FC<LabelProps> = ({ name, value, cx, x, y }) => {
    const textAnchor = x > cx ? "start" : "end";
    return (
      <>
        <text x={x} y={y} textAnchor={textAnchor} fill="#82ca9d">
          {name}
        </text>
        <text
          x={x}
          y={y}
          dominantBaseline="hanging"
          textAnchor={textAnchor}
          fill="#82ca9d"
        >
          {value}
        </text>
      </>
    );
  };

  return (
    <>
      <div className="flex ">
        <div className="pt-5 flex justifyContent-center flex-col items-center">
          <Select
            value={paymentSettingTime}
            onChange={handlePaymentTimeChange}
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              height: "32px",
              width: "110px",
              fontSize: "1rem",
            }}
          >
            <MenuItem
              value={"month"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              月間
            </MenuItem>
            <MenuItem
              value={"year"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              年間
            </MenuItem>
            <MenuItem
              value={"all"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              全期間
            </MenuItem>
          </Select>
          <PieChart width={400} height={400}>
            <Pie
              data={paymentData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label={label}
            />
          </PieChart>
        </div>
        <div className="mt-5 flex justifyContent-center flex-col items-center">
          <Select
            value={incometSettingTime}
            onChange={handleIncomeTimeChange}
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              height: "32px",
              width: "110px",
              fontSize: "1rem",
            }}
          >
            <MenuItem
              value={"month"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              月間
            </MenuItem>
            <MenuItem
              value={"year"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              年間
            </MenuItem>
            <MenuItem
              value={"all"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              全期間
            </MenuItem>
          </Select>
          <PieChart width={400} height={400}>
            <Pie
              data={incomeData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label={label}
            />
          </PieChart>{" "}
        </div>
      </div>
    </>
  );
};
