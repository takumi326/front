"use client";
import React, { useState, useEffect, useContext } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import styles from "./chart.module.css";

import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

import { MoneyCalendar } from "@/components/plate/moneyCalendar";
import { MoneyTable } from "@/components/plate/moneyTable";
import { AccountNextMonthTable } from "@/components/plate/accountNextMonthTable";

// import { PurposeTable } from "@/components/plate/purposeTable";

import { MoneyProvider, moneyContext } from "@/context/money-context";

ChartJS.register(ArcElement, Tooltip, Legend);

const Money: React.FC = () => {
  return (
    <>
      <MoneyProvider>
        <ul className="py-6 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <div>
              <div className="flex justify-between font-bold">
                <p>年の変更</p>
                <p className="text-right">月の変更</p>
              </div>
              <MoneyCalendar />
            </div>
            <div className="">
              <p className=" font-bold text-center">
                来月以降口座に残ってるお金 （口座ごと）
              </p>
              <AccountNextMonthTable />
            </div>
          </div>
          <div className="pr-10">
            {/* <div className="flex">
              <div>
                <p className="font-bold text-center">収入一覧</p>
                <Doughnut
                  data={data}
                  options={{
                    responsive: true,
                    aspectRatio: 1.33,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-center">支出一覧</p>
                <Doughnut
                  data={data}
                  options={{
                    responsive: true,
                    aspectRatio: 1.33,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-center">預金一覧</p>
                <Doughnut
                  data={data}
                  options={{
                    responsive: true,
                    aspectRatio: 1.33,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            </div>  */}
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
