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

import { MoneyProvider } from "@/context/money-context";

ChartJS.register(ArcElement, Tooltip, Legend);

const Money: React.FC = () => {
  const [filter, setFilter] = useState<"payment" | "income" | "account">(
    "payment"
  );

  const handleFilterChange = (value: "payment" | "income" | "account") => {
    setFilter(value);
  };

  const data = {
    datasets: [
      {
        label: "",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <MoneyProvider>
        <ul className="py-6 grid grid-cols-2">
          <div>
            <div className="pl-10 max-w-3xl">
              <MoneyCalendar />
            </div>
            <div>
              <p className="font-bold text-center">
                来月以降に残ってるお金 （口座ごと）
              </p>
            </div>
          </div>
          <div className="pr-10">
            <div className="flex">
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
            </div>
            <div className="pr-10">
              <p className="font-bold text-lg">収支/預金一覧</p>
              <MoneyTable />
            </div>
          </div>
        </ul>
      </MoneyProvider>
    </>
  );
};

export default Money;
