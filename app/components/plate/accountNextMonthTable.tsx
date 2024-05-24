"use client";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";

import {
  IconButton,
  TableContainer,
  TableCell,
  TableRow,
  Collapse,
  Box,
  Typography,
  TableFooter,
  Stack,
  Paper,
  Table,
  TableHead,
  TableBody,
  TablePagination,
} from "@mui/material";

import { moneyContext } from "@/context/money-context";

// 表の行コンポーネント
export const AccountNextMonthTable: React.FC = () => {
  const {
    accounts,
    payments,
    incomes,
    classifications,
    classificationMonthlyAmounts,
    currentMonth,
  } = useContext(moneyContext);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

  const formatDate = (date: Date | ""): string => {
    if (!date) return "";
    return moment(date).format("MM/DD/YY");
  };

  const currentMont = new Date().getMonth() + 1;
  const months = [
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
    "1月",
    "2月",
    "3月",
  ];
  const [page, setPage] = useState(0);
  const [displayMonth, setDisplayMonth] = useState([]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 30 }, (_, index) =>
    (currentYear + index).toString()
  );

  useEffect(() => {
    if (page === 0) {
      setDisplayMonth([...months.slice(currentMont - 4)]);
    } else {
      setDisplayMonth(months);
    }
  }, [page, selectedYear]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedYear(years[newPage]);
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const resetToCurrentYear = () => {
    setSelectedYear(currentYear);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper} sx={{ maxHeight: 126 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150 }}>
                口座 {selectedYear}年度
              </TableCell>
              {displayMonth.map((month, index) => (
                <TableCell key={index} sx={{ minWidth: 80 }}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{displayMonth.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <button
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={resetToCurrentYear}
        >
          今年度に戻る
        </button>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={years.length}
          rowsPerPage={1}
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={() => `${selectedYear}年度`}
        />
      </Stack>
    </Paper>
  );
};
