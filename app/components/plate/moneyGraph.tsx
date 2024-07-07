"use client";
import React, { useState, useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { PieChart, Pie } from "recharts";

import { moneyContext } from "@/context/money-context";

export const MoneyGraph = (): JSX.Element => {
  const {
    allPayments,
    repetitionMoneies,
    allIncomes,
    categories,
    currentMonth,
    isEditing,
  } = useContext(moneyContext);
  const [paymentSettingTime, setPaymentSettingTime] = useState<
    "month" | "year" | "all"
  >("month");
  const [paymentSettingData, setPaymentSettingData] = useState<
    { name: string; value: number }[]
  >([]);

  const [incomeSettingTime, setIncomeSettingTime] = useState<
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
    let startTime: Date;
    let endTime: Date;
    if (paymentSettingTime === "month") {
      startTime = new Date(
        Number(currentMonth.slice(0, 4)),
        Number(currentMonth.slice(4)) - 1,
        1
      );
      endTime = new Date(
        Number(currentMonth.slice(0, 4)),
        Number(currentMonth.slice(4)),
        0,
        23,
        59
      );
      settingDatas = categories.map((category) => {
        let value: number = 0;
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id &&
              payment.repetition === false &&
              new Date(payment.schedule).getTime() >= startTime.getTime() &&
              new Date(payment.schedule).getTime() <= endTime.getTime()
          )
          .forEach((payment) => (value += parseFloat(String(payment.amount))));
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id && payment.repetition === true
          )
          .forEach((payment) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "payment" &&
                  repetitionMoney.payment_id === payment.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    startTime.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    } else if (paymentSettingTime === "year") {
      if (Number(currentMonth.slice(4)) >= 4) {
        startTime = new Date(Number(currentMonth.slice(0, 4)), 3, 1);
        endTime = new Date(
          Number(currentMonth.slice(0, 4)) + 1,
          2,
          31,
          23,
          59,
          59
        );
      } else {
        startTime = new Date(Number(currentMonth.slice(0, 4)) - 1, 3, 1);
        endTime = new Date(Number(currentMonth.slice(0, 4)), 2, 31, 23, 59, 59);
      }

      settingDatas = categories.map((category) => {
        let value: number = 0;
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id &&
              payment.repetition === false &&
              new Date(payment.schedule).getTime() >= startTime.getTime() &&
              new Date(payment.schedule).getTime() <= endTime.getTime()
          )
          .forEach((payment) => (value += parseFloat(String(payment.amount))));
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id && payment.repetition === true
          )
          .forEach((payment) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "payment" &&
                  repetitionMoney.payment_id === payment.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    startTime.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    } else {
      endTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        23,
        59,
        0,
        0
      );
      settingDatas = categories.map((category) => {
        let value: number = 0;
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id &&
              payment.repetition === false &&
              new Date(payment.schedule).getTime() <= endTime.getTime()
          )
          .forEach((payment) => (value += parseFloat(String(payment.amount))));
        allPayments
          .filter(
            (payment) =>
              payment.category_id === category.id && payment.repetition === true
          )
          .forEach((payment) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "payment" &&
                  repetitionMoney.payment_id === payment.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    }
    setPaymentSettingData(settingDatas.filter((data) => data.value != 0));
  }, [paymentSettingTime, isEditing]);

  useEffect(() => {
    let settingDatas: { name: string; value: number }[] = [];
    let startTime: Date;
    let endTime: Date;
    if (incomeSettingTime === "month") {
      startTime = new Date(
        Number(currentMonth.slice(0, 4)),
        Number(currentMonth.slice(4)) - 1,
        1
      );
      endTime = new Date(
        Number(currentMonth.slice(0, 4)),
        Number(currentMonth.slice(4)),
        0,
        23,
        59
      );
      settingDatas = categories.map((category) => {
        let value: number = 0;
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id &&
              income.repetition === false &&
              new Date(income.schedule).getTime() >= startTime.getTime() &&
              new Date(income.schedule).getTime() <= endTime.getTime()
          )
          .forEach((income) => (value += parseFloat(String(income.amount))));
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id && income.repetition === true
          )
          .forEach((income) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "income" &&
                  repetitionMoney.income_id === income.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    startTime.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    } else if (incomeSettingTime === "year") {
      if (Number(currentMonth.slice(4)) >= 4) {
        startTime = new Date(Number(currentMonth.slice(0, 4)), 3, 1);
        endTime = new Date(
          Number(currentMonth.slice(0, 4)) + 1,
          2,
          31,
          23,
          59,
          59
        );
      } else {
        startTime = new Date(Number(currentMonth.slice(0, 4)) - 1, 3, 1);
        endTime = new Date(Number(currentMonth.slice(0, 4)), 2, 31, 23, 59, 59);
      }

      settingDatas = categories.map((category) => {
        let value: number = 0;
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id &&
              income.repetition === false &&
              new Date(income.schedule).getTime() >= startTime.getTime() &&
              new Date(income.schedule).getTime() <= endTime.getTime()
          )
          .forEach((income) => (value += parseFloat(String(income.amount))));
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id && income.repetition === true
          )
          .forEach((income) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "income" &&
                  repetitionMoney.income_id === income.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    startTime.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    } else {
      endTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        23,
        59,
        0,
        0
      );
      settingDatas = categories.map((category) => {
        let value: number = 0;
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id &&
              income.repetition === false &&
              new Date(income.schedule).getTime() <= endTime.getTime()
          )
          .forEach((income) => (value += parseFloat(String(income.amount))));
        allIncomes
          .filter(
            (income) =>
              income.category_id === category.id && income.repetition === true
          )
          .forEach((income) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "income" &&
                  repetitionMoney.income_id === income.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endTime.getTime()
              )
              .forEach(
                (repetitionMoney) =>
                  (value += parseFloat(String(repetitionMoney.amount)))
              )
          );
        return {
          name: category.name,
          value: value,
        };
      });
    }
    setIncomeSettingData(settingDatas.filter((data) => data.value != 0));
  }, [incomeSettingTime, isEditing]);

  const handlePaymentTimeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as "month" | "year" | "all";
    setPaymentSettingTime(value);
  };

  const handleIncomeTimeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as "month" | "year" | "all";
    setIncomeSettingTime(value);
  };

  const label: React.FC<LabelProps> = ({ name, value, cx, x, y }) => {
    const textAnchor = x > cx ? "start" : "end";
    const nameOffsetY = -10;
    const valueOffsetY = 5;
    return (
      <>
        <text
          x={x}
          y={y + nameOffsetY}
          textAnchor={textAnchor}
          fill="#000000"
          style={{ fontSize: "12px", fontFamily: "Arial, sans-serif" }}
        >
          {name}
        </text>
        <text
          x={x}
          y={y + valueOffsetY}
          dominantBaseline="hanging"
          textAnchor={textAnchor}
          fill="#000000"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}円
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
              今月
            </MenuItem>
            <MenuItem
              value={"year"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              今年度
            </MenuItem>
            <MenuItem
              value={"all"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              今日までの全期間
            </MenuItem>
          </Select>
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {paymentSettingData.length > 0 ? (
              <>
                <div
                  style={{
                    marginTop: 90,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  合計：
                  {paymentSettingData
                    .reduce((acc, curr) => acc + curr.value, 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  円
                </div>
                <PieChart width={400} height={400}>
                  <Pie
                    data={paymentSettingData}
                    dataKey="value"
                    cx="50%"
                    cy="40%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#82ca9d"
                    label={label}
                  />
                </PieChart>
              </>
            ) : (
              <div>該当データなし</div>
            )}
          </div>
        </div>
        <div className="mt-5 flex justifyContent-center flex-col items-center">
          <Select
            value={incomeSettingTime}
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
              今月
            </MenuItem>
            <MenuItem
              value={"year"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              今年度
            </MenuItem>
            <MenuItem
              value={"all"}
              sx={{
                height: "32px",
                fontSize: "0.875rem",
              }}
            >
              今日までの全期間
            </MenuItem>
          </Select>
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {incomeSettingData.length > 0 ? (
              <>
                <div
                  style={{
                    marginTop: 90,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  合計：
                  {incomeSettingData
                    .reduce((acc, curr) => acc + curr.value, 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  円
                </div>
                <PieChart width={400} height={400}>
                  <Pie
                    data={incomeSettingData}
                    dataKey="value"
                    cx="50%"
                    cy="40%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#82ca9d"
                    label={label}
                  />
                </PieChart>
              </>
            ) : (
              <div>該当データなし</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
