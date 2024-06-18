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
    transfers,
    repetitionMoneies,
    classifications,
    classificationMonthlyAmounts,
    currentMonth,
  } = useContext(moneyContext);
  const currentYear = new Date().getFullYear();
  const currentMont = new Date().getMonth() + 1;
  const now = new Date();
  const endOfCurrentDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    0,
    0
  );
  // const endCurrentMonth = new Date(
  //   Number(currentMonth.slice(0, 4)),
  //   Number(currentMonth.slice(4)),
  //   0,
  //   23,
  //   59
  // );

  const [page, setPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState<string[]>([]);
  const [displayAccountId, setDisplayAccountId] = useState("");
  const [displayAccountMonthlyMoney, setDisplayAccountMonthlyMoney] = useState<
    string[]
  >([]);

  // useEffect(() => {
  //   console.log(selectedYear);
  //   console.log(displayMonth);
  //   console.log(currentMont);
  // }, [selectedYear, displayMonth]);

  useEffect(() => {
    let stanp = 0;
    for (let i = 0; i < months.length; i += 1) {
      if (Number(months[i]) === currentMont) {
        stanp = i + 1;
      }
    }
    if (page === 0) {
      setDisplayMonth([...months.slice(stanp)]);
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
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "1",
    "2",
    "3",
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

    const gap = selectedYear - Number(currentMonth.slice(0, 4));

    let data: string[] = [];
    let money: number = 0;
    // accounts.filter(
    //   (account) => account.id === displayAccountId
    // )[0].amount;
    let reduceMoney: number;
    let increaseMoney: number;
    for (let t = 0; t <= gap; t += 1) {
      for (let i = 0; i < displayMonth.length; i += 1) {
        let startCurrentMonth: Date;
        let endCurrentMonth: Date;
        // console.log(displayMonth[i]);
        if (
          Number(displayMonth[i]) === 1 ||
          Number(displayMonth[i]) === 2 ||
          Number(displayMonth[i]) === 3
        ) {
          startCurrentMonth = new Date(
            Number(selectedYear) + 1 + t,
            Number(displayMonth[i]) - 2,
            1
          );
          endCurrentMonth = new Date(
            Number(selectedYear) + 1 + t,
            Number(displayMonth[i]) - 1,
            0,
            23,
            59
          );
        } else {
          startCurrentMonth = new Date(
            Number(selectedYear) + t,
            Number(displayMonth[i]) - 2,
            1
          );
          endCurrentMonth = new Date(
            Number(selectedYear) + t,
            Number(displayMonth[i]) - 1,
            0,
            23,
            59
          );
        }
        // console.log(startCurrentMonth);
        // console.log(endCurrentMonth);

        //減少分
        classifications
          .filter(
            (classification) => classification.classification_type === "payment"
          )
          .map((classification) =>
            classificationMonthlyAmounts
              .filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                    classification.id &&
                  classificationMonthlyAmount.month ===
                    `${selectedYear}${Number(displayMonth[i]) - 1}`
              )
              .map(
                (classificationMonthlyAmount) =>
                  (reduceMoney += classificationMonthlyAmount.amount)
              )
          );
        transfers
          .filter(
            (transfer) =>
              transfer.before_account_id === displayAccountId &&
              new Date(transfer.schedule).getTime() >=
                endOfCurrentDay.getTime() &&
              transfer.repetition === false &&
              new Date(transfer.schedule).getTime() >=
                startCurrentMonth.getTime() &&
              new Date(transfer.schedule).getTime() <= endCurrentMonth.getTime()
          )
          .map((transfer) => (reduceMoney += transfer.amount));
        transfers
          .filter((transfer) => transfer.before_account_id === displayAccountId)
          .map((transfer) =>
            repetitionMoneies
              .filter(
                (repetitionMoney) =>
                  repetitionMoney.transfer_id === transfer.id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    startCurrentMonth.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    endCurrentMonth.getTime()
              )
              .map((repetitionMoney) => (reduceMoney += repetitionMoney.amount))
          );

        //増加分
        classifications
          .filter(
            (classification) => classification.classification_type === "income"
          )
          .map((classification) =>
            classificationMonthlyAmounts
              .filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                    classification.id &&
                  classificationMonthlyAmount.month ===
                    `${selectedYear}${Number(displayMonth[i]) - 1}`
              )
              .map(
                (classificationMonthlyAmount) =>
                  (increaseMoney += classificationMonthlyAmount.amount)
              )
          );
        if (Number(currentMonth.slice(0, 4)) === selectedYear) {
        } else {
        }
        data.push(`${selectedYear}${displayMonth[i]}`, String(money));
      }
    }
    // setDisplayAccountMonthlyMoney(data);
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
                  {month}月
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
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
