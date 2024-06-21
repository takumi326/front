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

  const [page, setPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState<string[]>([]);
  const [displayAccountId, setDisplayAccountId] = useState("");
  const [displayAccountMonthlyMoney, setDisplayAccountMonthlyMoney] = useState<
    string[]
  >([]);

  useEffect(() => {
    const gap = selectedYear - Number(currentMonth.slice(0, 4));

    let stanp = 0;
    let disMonth: string[];
    for (let i = 0; i < months.length; i += 1) {
      if (Number(months[i]) === currentMont) {
        stanp = i + 1;
      }
    }
    disMonth = [...months.slice(stanp)];

    let data: string[] = [];
    let setData: string[] = [];
    let money: number = 0;
    if (displayAccountId != "") {
      money = accounts.filter((account) => account.id === displayAccountId)[0]
        .amount;

      for (let t = 0; t <= gap; t += 1) {
        let month: string[];
        if (1 <= t) {
          month = months;
        } else {
          month = disMonth;
        }
        for (let i = 0; i < month.length; i += 1) {
          const year =
            Number(month[i]) === 1 ||
            Number(month[i]) === 2 ||
            Number(month[i]) === 3
              ? parseFloat(String(selectedYear)) - gap + t + 1
              : parseFloat(String(selectedYear)) - gap + t;
          let reduceMoney: number = 0;
          let increaseMoney: number = 0;
          let startReduceCurrentMonth: Date;
          let endReduceCurrentMonth: Date;
          let startIncreaseCurrentMonth: Date;
          let endIncreaseCurrentMonth: Date;

          startReduceCurrentMonth = new Date(year, Number(month[i] + 1) - 2, 1);
          endReduceCurrentMonth = new Date(
            year,
            Number(month[i] + 1) - 1,
            0,
            23,
            59
          );
          startIncreaseCurrentMonth = new Date(year, Number(month[i] ) - 2, 1);
          endIncreaseCurrentMonth = new Date(year, Number(month[i]) - 1, 0, 23, 59);

          //減少分
          classifications
            .filter(
              (classification) =>
                classification.classification_type === "payment" &&
                classification.account_id === displayAccountId
            )
            .map((classification) =>
              classificationMonthlyAmounts
                .filter(
                  (classificationMonthlyAmount) =>
                    classificationMonthlyAmount.classification_id ===
                      classification.id &&
                    `${classificationMonthlyAmount.month.slice(0, 4)}${
                      parseFloat(
                        String(classificationMonthlyAmount.month.slice(4))
                      ) + 1
                    }` === `${year}${Number(month[i]) - 1}`
                )
                .map(
                  (classificationMonthlyAmount) =>
                    (reduceMoney += parseFloat(
                      String(classificationMonthlyAmount.amount)
                    ))
                )
            );
          classifications
            .filter(
              (classification) =>
                classification.classification_type === "payment" &&
                classification.account_id === displayAccountId
            )
            .map((classification) => {
              const classificationMonthlyAmount =
                classificationMonthlyAmounts.filter(
                  (classificationMonthlyAmount) =>
                    classificationMonthlyAmount.classification_id ===
                      classification.id &&
                    `${classificationMonthlyAmount.month.slice(0, 4)}${
                      parseFloat(
                        String(classificationMonthlyAmount.month.slice(4))
                      ) + 1
                    }` === `${year}${Number(month[i]) - 1}`
                )[0];
              if (classificationMonthlyAmount === undefined) {
                payments
                  .filter(
                    (payment) =>
                      payment.classification_id === classification.id &&
                      payment.repetition === false &&
                      new Date(payment.schedule).getTime() >=
                        startReduceCurrentMonth.getTime() &&
                      new Date(payment.schedule).getTime() <=
                        endReduceCurrentMonth.getTime()
                  )
                  .map(
                    (payment) =>
                      (reduceMoney += parseFloat(String(payment.amount)))
                  );
                payments
                  .filter(
                    (payment) =>
                      payment.classification_id === classification.id &&
                      payment.repetition === true
                  )
                  .map((payment) =>
                    repetitionMoneies
                      .filter(
                        (repetitionMoney) =>
                          repetitionMoney.payment_id === payment.id &&
                          new Date(
                            repetitionMoney.repetition_schedule
                          ).getTime() >= startReduceCurrentMonth.getTime() &&
                          new Date(
                            repetitionMoney.repetition_schedule
                          ).getTime() <= endReduceCurrentMonth.getTime()
                      )
                      .map(
                        (repetitionMoney) =>
                          (reduceMoney += parseFloat(
                            String(repetitionMoney.amount)
                          ))
                      )
                  );
              }
            });
          transfers
            .filter(
              (transfer) =>
                transfer.before_account_id === displayAccountId &&
                new Date(transfer.schedule).getTime() >=
                  endOfCurrentDay.getTime() &&
                transfer.repetition === false &&
                new Date(transfer.schedule).getTime() >=
                  startReduceCurrentMonth.getTime() &&
                new Date(transfer.schedule).getTime() <=
                  endReduceCurrentMonth.getTime()
            )
            .map(
              (transfer) => (reduceMoney += parseFloat(String(transfer.amount)))
            );
          transfers
            .filter(
              (transfer) =>
                transfer.before_account_id === displayAccountId &&
                transfer.repetition === true
            )
            .map((transfer) =>
              repetitionMoneies
                .filter(
                  (repetitionMoney) =>
                    repetitionMoney.transfer_id === transfer.id &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      endOfCurrentDay.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      startReduceCurrentMonth.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() <=
                      endReduceCurrentMonth.getTime()
                )
                .map(
                  (repetitionMoney) =>
                    (reduceMoney += parseFloat(String(repetitionMoney.amount)))
                )
            );

          //増加分
          classifications
            .filter(
              (classification) =>
                classification.classification_type === "income" &&
                classification.account_id === displayAccountId
            )
            .map((classification) => {
              incomes
                .filter(
                  (income) =>
                    income.classification_id === classification.id &&
                    income.repetition === false &&
                    new Date(income.schedule).getTime() >=
                      startIncreaseCurrentMonth.getTime() &&
                    new Date(income.schedule).getTime() <=
                      endIncreaseCurrentMonth.getTime()
                )
                .map(
                  (income) =>
                    (increaseMoney += parseFloat(String(income.amount)))
                );
              incomes
                .filter(
                  (income) =>
                    income.classification_id === classification.id &&
                    income.repetition === true
                )
                .map((income) =>
                  repetitionMoneies
                    .filter(
                      (repetitionMoney) =>
                        repetitionMoney.income_id === income.id &&
                        new Date(
                          repetitionMoney.repetition_schedule
                        ).getTime() >= startIncreaseCurrentMonth.getTime() &&
                        new Date(
                          repetitionMoney.repetition_schedule
                        ).getTime() <= endIncreaseCurrentMonth.getTime()
                    )
                    .map(
                      (repetitionMoney) =>
                        (increaseMoney += parseFloat(
                          String(repetitionMoney.amount)
                        ))
                    )
                );
            });
          transfers
            .filter(
              (transfer) =>
                transfer.after_account_id === displayAccountId &&
                new Date(transfer.schedule).getTime() >=
                  endOfCurrentDay.getTime() &&
                transfer.repetition === false &&
                new Date(transfer.schedule).getTime() >=
                  startIncreaseCurrentMonth.getTime() &&
                new Date(transfer.schedule).getTime() <=
                  endIncreaseCurrentMonth.getTime()
            )
            .map(
              (transfer) =>
                (increaseMoney += parseFloat(String(transfer.amount)))
            );
          transfers
            .filter(
              (transfer) =>
                transfer.after_account_id === displayAccountId &&
                transfer.repetition === true
            )
            .map((transfer) =>
              repetitionMoneies
                .filter(
                  (repetitionMoney) =>
                    repetitionMoney.transfer_id === transfer.id &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      endOfCurrentDay.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      startIncreaseCurrentMonth.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() <=
                      endIncreaseCurrentMonth.getTime()
                )
                .map(
                  (repetitionMoney) =>
                    (increaseMoney += parseFloat(
                      String(repetitionMoney.amount)
                    ))
                )
            );
          console.log(reduceMoney);
          console.log(increaseMoney);
          // console.log(money);
          // console.log(data);
          money = parseFloat(String(money)) + increaseMoney - reduceMoney;
          data.push(`${year}${month[i]}`, String(money));
        }
      }
    }

    for (let p = 0; p < data.length; p += 2) {
      let month: string[];
      if (1 <= p) {
        month = months;
      } else {
        month = disMonth;
      }
      for (let l = 0; l < month.length; l += 1) {
        if (
          Number(month[l]) === 1 ||
          Number(month[l]) === 2 ||
          Number(month[l]) === 3
        ) {
          if (
            data[p] === `${parseFloat(String(selectedYear)) + 1}${month[l]}`
          ) {
            setData.push(data[p + 1]);
          }
        } else {
          if (data[p] === `${selectedYear}${month[l]}`) {
            setData.push(data[p + 1]);
          }
        }
      }
    }
    setDisplayAccountMonthlyMoney(setData);
  }, [
    displayAccountId,
    selectedYear,
    accounts,
    payments,
    incomes,
    transfers,
    repetitionMoneies,
    classifications,
    classificationMonthlyAmounts,
  ]);

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

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

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
                <TableCell key={index} sx={{ minWidth: 120 }}>
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
              {displayMonth.map((displayMonth, index) => (
                <TableCell key={index}>
                  {displayAccountId === ""
                    ? ""
                    : formatAmountCommas(
                        Number(displayAccountMonthlyMoney[index])
                      )}
                </TableCell>
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
