"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";

import { MoneyGraph } from "@/components/plate/moneyGraph";
import { MoneyCalendar } from "@/components/plate/moneyCalendar";
import { MoneyTable } from "@/components/plate/moneyTable";
import { AccountNextMonthTable } from "@/components/plate/accountNextMonthTable";

import { MoneyProvider } from "@/context/money-context";

const Money: React.FC = () => {
  const [changeGraphOrCalendar, setChangeGraphOrCalendar] =
    useState("calendar");

  const handleButtonChange = (value: "calendar" | "graph") => {
    setChangeGraphOrCalendar(value);
  };
  return (
    <>
      <MoneyProvider>
        <ul className="py-6 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <div className="ml-auto">
              <Button
                variant={
                  changeGraphOrCalendar === "calendar"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleButtonChange("calendar")}
                className="ml-auto"
              >
                カレンダー
              </Button>
              <Button
                variant={
                  changeGraphOrCalendar === "graph" ? "contained" : "outlined"
                }
                onClick={() => handleButtonChange("graph")}
                className="ml-auto"
              >
                グラフ
              </Button>
            </div>
            {changeGraphOrCalendar === "calendar" ? (
              <>
                <div>
                  <div className="flex justify-between font-bold">
                    <p>年の変更</p>
                    <p className="text-right">月の変更</p>
                  </div>
                  <MoneyCalendar />
                </div>
              </>
            ) : (
              <>
                <div>
                  <MoneyGraph />
                </div>
              </>
            )}
            <div>
              <p className="font-bold text-center">
                来月以降の月始めの予想残高 （名称ごと）
              </p>
              <AccountNextMonthTable />
            </div>
          </div>
          <div className="pr-10">
            <div className="pr-10 pt-5">
              <MoneyTable />
            </div>
          </div>
        </ul>
      </MoneyProvider>
    </>
  );
};

export default Money;
