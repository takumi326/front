"use client";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";

import {
  IconButton,
  TableCell,
  TableRow,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { incomeDelete } from "@/lib/api/income-api";
import { classificationDelete } from "@/lib/api/classification-api";
import {
  classificationMonthlyAmountNew,
  classificationMonthlyAmountEdit,
} from "@/lib/api/classificationMonthlyAmount-api";

import {
  incomeRowProps,
  displayIncomeData,
} from "@/interface/Income-interface";
import { classificationMonthlyAmountData } from "@/lib/api/classification-interface";

import { IncomeShow } from "@/components/money/income/show";
import { ClassificationShow } from "@/components/money/classification/show";

export const IncomeRow: React.FC<incomeRowProps> = (props) => {
  const { row, start, end, visibleColumns } = props;
  const {
    repetitionMoneies,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
  } = useContext(moneyContext);

  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [isEditClassificationModalOpen, setIsEditClassificationModalOpen] =
    useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log(repetitionMoneies);
    const handleClassificationMonthlyAmount = async () => {
      setIsProcessing(true);
      try {
        const shouldCreateNewAmount: classificationMonthlyAmountData =
          classificationMonthlyAmounts.some(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id === row.id &&
              classificationMonthlyAmount.month === currentMonth
          );

        const selectedClassificationMonthlyAmounts: classificationMonthlyAmountData[] =
          classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id === row.id
          );

        const dateCounts: { [key: string]: number } = {};

        selectedClassificationMonthlyAmounts.forEach(
          (classificationMonthlyAmount) => {
            const date = classificationMonthlyAmount.date;
            if (dateCounts[date]) {
              dateCounts[date]++;
            } else {
              dateCounts[date] = 1;
            }
          }
        );

        let maxCount = 0;
        let mostFrequentDate: string = "";

        for (const date in dateCounts) {
          if (dateCounts[date] > maxCount) {
            maxCount = dateCounts[date];
            mostFrequentDate = date;
          }
        }

        let money = 0;
        if (!shouldCreateNewAmount) {
          row.history.map((historyRow) => {
            if (historyRow.income_repetition === true) {
              repetitionMoneies
                .filter(
                  (repetitionMoney) =>
                    repetitionMoney.income_id === historyRow.income_id &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      start.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() <=
                      end.getTime()
                )
                .map((repetitionMoney) => {
                  money += parseFloat(String(repetitionMoney.amount));
                });
            } else {
              money += parseFloat(String(historyRow.income_amount));
            }
          });
          await classificationMonthlyAmountNew(
            row.id,
            currentMonth,
            mostFrequentDate,
            money
          );
        }
      } catch (error) {
        console.error("Failed to new classificationMonthlyAmount:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    if (!isProcessing) {
      handleClassificationMonthlyAmount();
    }
  }, [row]);

  const handleOpenEditIncomeModal = (index: number) => {
    setIsEditIncomeModalOpen(true);
    setIsHistory(index);
  };

  const handleCloseEditIncomeModal = () => {
    setIsEditIncomeModalOpen(false);
  };

  const handleOpenEditClassificationModal = () => {
    setIsEditClassificationModalOpen(true);
  };

  const handleCloseEditClassificationModal = () => {
    setIsEditClassificationModalOpen(false);
  };

  const handleIncomeDelete = async (id: string, index: number) => {
    try {
      if (row.classification_name === "分類なし") {
        incomeDelete(id);
      } else {
        if (row.history[index].income_repetition === true) {
          for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id === row.id
          )) {
            let money = parseFloat(String(classificationMonthlyAmount.amount));
            const start = new Date(
              Number(classificationMonthlyAmount.month.slice(0, 4)),
              Number(classificationMonthlyAmount.month.slice(4)) - 1,
              1
            );
            const end = new Date(
              Number(classificationMonthlyAmount.month.slice(0, 4)),
              Number(classificationMonthlyAmount.month.slice(4)),
              0,
              23,
              59
            );

            for (const repetitionMoney of repetitionMoneies.filter(
              (repetitionMoney) =>
                repetitionMoney.transaction_type === "income" &&
                repetitionMoney.income_id === id &&
                new Date(repetitionMoney.repetition_schedule).getTime() >=
                  start.getTime() &&
                new Date(repetitionMoney.repetition_schedule).getTime() <=
                  end.getTime()
            )) {
              money -= parseFloat(String(repetitionMoney.amount));
            }

            await classificationMonthlyAmountEdit(
              classificationMonthlyAmount.id,
              classificationMonthlyAmount.classification_id,
              classificationMonthlyAmount.month,
              classificationMonthlyAmount.date,
              money
            );
          }
        } else {
          const editClassificationMonthlyAmount: classificationMonthlyAmountData =
            classificationMonthlyAmounts.find(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id === row.id &&
                classificationMonthlyAmount.month === currentMonth
            );

          if (editClassificationMonthlyAmount) {
            const editClassificationAmount =
              parseFloat(String(editClassificationMonthlyAmount.amount)) -
              parseFloat(String(row.history[index].income_amount));

            await classificationMonthlyAmountEdit(
              editClassificationMonthlyAmount.id,
              editClassificationMonthlyAmount.classification_id,
              editClassificationMonthlyAmount.month,
              editClassificationMonthlyAmount.date,
              Math.max(0, editClassificationAmount)
            );
          }
        }
        incomeDelete(id);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to edit income:", error);
    }
  };

  const deleteClassification = async (id: string) => {
    try {
      await classificationDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete classification:", error);
    }
  };

  const repetitionAllMoney = (id: string) => {
    let money = 0;
    repetitionMoneies
      .filter(
        (repetitionMoney) =>
          repetitionMoney.income_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() >=
            start.getTime() &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            end.getTime()
      )
      .map(
        (repetitionMoney) =>
          (money += parseFloat(String(repetitionMoney.amount)))
      );
    return Number(money);
  };

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

  const renderRepetition = (index: number) => {
    const { income_repetition_type, income_repetition_settings } =
      row.history[index];
    if (!income_repetition_type || !income_repetition_settings) return "";

    if (
      income_repetition_type === "daily" &&
      Number(income_repetition_settings[0]) === 1
    ) {
      return "毎日";
    } else if (
      income_repetition_type === "weekly" &&
      Number(income_repetition_settings[0]) === 1
    ) {
      return `毎週 ${income_repetition_settings.slice(1).join(" ")}`;
    } else if (
      income_repetition_type === "monthly" &&
      Number(income_repetition_settings[0]) === 1
    ) {
      return "毎月";
    } else if (Number(income_repetition_settings[0]) > 1) {
      return `毎${income_repetition_settings[0]}${
        income_repetition_type === "daily"
          ? "日"
          : income_repetition_type === "weekly"
          ? `週 ${income_repetition_settings.slice(1).join(" ")}`
          : "月"
      }`;
    } else {
      return "";
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "";
    return moment(date).format("MM/DD/YY");
  };

  return (
    <React.Fragment>
      {isEditClassificationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditClassificationModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <ClassificationShow
              id={row.id}
              account_id={row.classification_account_id}
              account_name={row.classification_account_name}
              name={row.classification_name}
              classification_type={"income"}
              onClose={handleCloseEditClassificationModal}
              onDelete={deleteClassification}
            />
          </div>
        </div>
      )}

      {isEditIncomeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditIncomeModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <IncomeShow
              id={row.history[isHistory].income_id}
              category_id={row.history[isHistory].income_category_id}
              classification_id={
                row.history[isHistory].income_classification_id
              }
              amount={row.history[isHistory].income_amount}
              schedule={row.history[isHistory].income_schedule}
              end_date={row.history[isHistory].income_end_date}
              repetition={row.history[isHistory].income_repetition}
              repetition_type={row.history[isHistory].income_repetition_type}
              repetition_settings={
                row.history[isHistory].income_repetition_settings
              }
              body={row.history[isHistory].income_body}
              onClose={handleCloseEditIncomeModal}
            />
          </div>
        </div>
      )}

      <TableRow
        key={row.id}
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor: isHistoryOpen ? "#f5f5f5" : "transparent",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            {isHistoryOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        {Object.keys(visibleColumns).map((key) =>
          visibleColumns[key] ? (
            <>
              {key === "classification_name" ? (
                <TableCell key={key} component="th" scope="row">
                  {row.classification_classification_type === "income" &&
                  row.classification_name !== "分類なし" ? (
                    <button
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={handleOpenEditClassificationModal}
                    >
                      {row.classification_name}
                    </button>
                  ) : (
                    row.classification_name
                  )}
                </TableCell>
              ) : key === "classification_amount" ? (
                <TableCell
                  key={key}
                  component="th"
                  scope="row"
                  className="pl-12"
                >
                  {row.classification_name !== "分類なし"
                    ? formatAmountCommas(
                        classificationMonthlyAmounts
                          .filter(
                            (classificationMonthlyAmount) =>
                              classificationMonthlyAmount.month ===
                                currentMonth &&
                              classificationMonthlyAmount.classification_id ===
                                row.id
                          )
                          .map(
                            (classificationMonthlyAmount) =>
                              classificationMonthlyAmount.amount
                          )[0]
                      )
                    : ""}
                </TableCell>
              ) : key === "classification_account_name" ? (
                <TableCell key={key} component="th" scope="row">
                  {row.classification_account_name === null
                    ? ""
                    : String(row[key as keyof displayIncomeData])}
                </TableCell>
              ) : (
                <TableCell key={key} component="th" scope="row">
                  {row.classification_account_name === null
                    ? ""
                    : classificationMonthlyAmounts
                        .filter(
                          (classificationMonthlyAmount) =>
                            classificationMonthlyAmount.month ===
                              currentMonth &&
                            classificationMonthlyAmount.classification_id ===
                              row.id
                        )
                        .map(
                          (classificationMonthlyAmount) =>
                            classificationMonthlyAmount.date
                        )[0]}
                </TableCell>
              )}
            </>
          ) : null
        )}
        <TableCell align="right">
          {row.classification_name !== "分類なし" && (
            <IconButton onClick={() => deleteClassification(row.id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {row.history.length > 0 && (
        <TableRow
          sx={{
            "& > *": {
              borderBottom: "unset",
              backgroundColor: isHistoryOpen ? "#f5f5f5" : "transparent",
            },
          }}
        >
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  支出
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>カテゴリ</TableCell>
                      <TableCell>金額</TableCell>
                      <TableCell>繰り返し</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow, historyIndex) => (
                      <TableRow key={historyRow.income_id}>
                        <TableCell component="th" scope="row">
                          {historyRow.income_repetition === false
                            ? formatDate(historyRow.income_schedule)
                            : ""}
                        </TableCell>
                        <TableCell>
                          <button
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleOpenEditIncomeModal(historyIndex)
                            }
                          >
                            {historyRow.income_category_name !== null
                              ? historyRow.income_category_name
                              : "なし"}
                          </button>
                        </TableCell>
                        <TableCell>
                          {historyRow.income_repetition === false
                            ? formatAmountCommas(historyRow.income_amount)
                            : formatAmountCommas(
                                repetitionAllMoney(historyRow.income_id)
                              )}
                        </TableCell>
                        <TableCell>{renderRepetition(historyIndex)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              handleIncomeDelete(
                                historyRow.income_id,
                                isHistory
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};
