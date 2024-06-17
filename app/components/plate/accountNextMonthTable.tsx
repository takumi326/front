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
  MenuItem,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { moneyContext } from "@/context/money-context";

export const AccountNextMonthTable: React.FC = () => {
  const {
    accounts,
    isEditing,
    payments,
    incomes,
    classifications,
    classificationMonthlyAmounts,
    currentMonth,
  } = useContext(moneyContext);
  const currentYear = new Date().getFullYear();
  const currentMont = new Date().getMonth() + 1;

  const [page, setPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState<string[]>([]);
  const [displayAccountId, setDisplayAccountId] = useState("");

  useEffect(() => {
    if (page === 0) {
      setDisplayMonth([...months.slice(currentMont - 4)]);
    } else {
      setDisplayMonth(months);
    }
  }, [page, selectedYear]);

  const years = Array.from({ length: 30 }, (_, index) =>
    (currentYear + index).toString()
  );

  const sortedRows = accounts.slice().sort((a, b) => {
    return a.id > b.id ? 1 : -1;
  });

  // const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // const [isHistory, setIsHistory] = useState(0);

  // const formatAmountCommas = (number: number) => {
  //   const integerPart = Math.floor(number);
  //   const decimalPart = (number - integerPart).toFixed(0).slice(1);
  //   return (
  //     integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
  //     decimalPart +
  //     "円"
  //   );
  // };

  // const formatDate = (date: Date | ""): string => {
  //   if (!date) return "";
  //   return moment(date).format("MM/DD/YY");
  // };

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

  // useEffect(() => {
  //   if (sortedRows[0] != undefined) {
  //     setDisplayAccountId(sortedRows[0].id);
  //   }
  // }, [isEditing]);

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

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setDisplayAccountId(value);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper} sx={{ maxHeight: 126 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150 }}>
                名称{selectedYear}年度
              </TableCell>
              {displayMonth.map((month, index) => (
                <TableCell key={index} sx={{ minWidth: 80 }}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <Select
                    value={displayAccountId}
                    onChange={handleAccountChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      height: "32px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {sortedRows.map((sortedAccount) => (
                      <MenuItem
                        key={sortedAccount.id}
                        value={sortedAccount.id}
                        sx={{
                          height: "32px",
                          fontSize: "0.875rem",
                        }}
                      >
                        {sortedAccount.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                {displayMonth.map((month, index) => (
                  <TableCell key={index}>{month}</TableCell>
                ))}
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
