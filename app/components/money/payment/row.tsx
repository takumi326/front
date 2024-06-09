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

import { paymentDelete } from "@/lib/api/payment-api";
import { classificationDelete } from "@/lib/api/classification-api";
import {
  classificationMonthlyAmountNew,
  classificationMonthlyAmountEdit,
} from "@/lib/api/classificationMonthlyAmount-api";

import {
  paymentRowProps,
  displayPaymentData,
} from "@/interface/Payment-interface";
import { classificationMonthlyAmountData } from "@/lib/api/classification-interface";

import { PaymentShow } from "@/components/money/payment/show";
import { ClassificationShow } from "@/components/money/classification/show";

export const PaymentRow: React.FC<paymentRowProps> = (props) => {
  const { row, start, end, visibleColumns } = props;
  const {
    repetitionMoneies,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
  } = useContext(moneyContext);

  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isEditClassificationModalOpen, setIsEditClassificationModalOpen] =
    useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
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
          sortedHistoryRows.map((historyRow) => {
            if (historyRow.payment_repetition === true) {
              repetitionMoneies
                .filter(
                  (repetitionMoney) =>
                    repetitionMoney.payment_id === historyRow.payment_id &&
                    new Date(repetitionMoney.repetition_schedule).getTime() >=
                      start.getTime() &&
                    new Date(repetitionMoney.repetition_schedule).getTime() <=
                      end.getTime()
                )
                .map((repetitionMoney) => {
                  money += parseFloat(String(repetitionMoney.amount));
                });
            } else {
              money += parseFloat(String(historyRow.payment_amount));
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

  const handleOpenEditPaymentModal = (index: number) => {
    setIsEditPaymentModalOpen(true);
    setIsHistory(index);
  };

  const handleCloseEditPaymentModal = () => {
    setIsEditPaymentModalOpen(false);
  };

  const handleOpenEditClassificationModal = () => {
    setIsEditClassificationModalOpen(true);
  };

  const handleCloseEditClassificationModal = () => {
    setIsEditClassificationModalOpen(false);
  };

  const deletePayment = async (id: string, index: number) => {
    try {
      if (row.classification_name === "分類なし") {
        paymentDelete(id);
      } else {
        if (sortedHistoryRows[index].payment_repetition === true) {
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
                repetitionMoney.transaction_type === "payment" &&
                repetitionMoney.payment_id === id &&
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
              parseFloat(String(sortedHistoryRows[index].payment_amount));

            await classificationMonthlyAmountEdit(
              editClassificationMonthlyAmount.id,
              editClassificationMonthlyAmount.classification_id,
              editClassificationMonthlyAmount.month,
              editClassificationMonthlyAmount.date,
              Math.max(0, editClassificationAmount)
            );
          }
        }
        paymentDelete(id);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to edit payment:", error);
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
          repetitionMoney.payment_id === id &&
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
    const { payment_repetition_type, payment_repetition_settings } =
      sortedHistoryRows[index];
    if (!payment_repetition_type || !payment_repetition_settings) return "";

    if (
      payment_repetition_type === "daily" &&
      Number(payment_repetition_settings[0]) === 1
    ) {
      return "毎日";
    } else if (
      payment_repetition_type === "weekly" &&
      Number(payment_repetition_settings[0]) === 1
    ) {
      return `毎週 ${payment_repetition_settings.slice(1).join(" ")}`;
    } else if (
      payment_repetition_type === "monthly" &&
      Number(payment_repetition_settings[0]) === 1
    ) {
      return "毎月";
    } else if (Number(payment_repetition_settings[0]) > 1) {
      return `毎${payment_repetition_settings[0]}${
        payment_repetition_type === "daily"
          ? "日"
          : payment_repetition_type === "weekly"
          ? `週 ${payment_repetition_settings.slice(1).join(" ")}`
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

  const sortedHistoryRows = row.history.slice().sort((a, b) => {
    if (a.payment_repetition && !b.payment_repetition) {
      return -1;
    } else if (!a.payment_repetition && b.payment_repetition) {
      return 1;
    }

    const dateA = new Date(a.payment_schedule).getTime();
    const dateB = new Date(b.payment_schedule).getTime();
    return dateA > dateB ? 1 : -1;
  });

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
              name={row.classification_name}
              classification_type={"payment"}
              onClose={handleCloseEditClassificationModal}
              onDelete={deleteClassification}
            />
          </div>
        </div>
      )}

      {isEditPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditPaymentModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <PaymentShow
              id={sortedHistoryRows[isHistory].payment_id}
              category_id={sortedHistoryRows[isHistory].payment_category_id}
              classification_id={
                sortedHistoryRows[isHistory].payment_classification_id
              }
              amount={sortedHistoryRows[isHistory].payment_amount}
              schedule={sortedHistoryRows[isHistory].payment_schedule}
              end_date={sortedHistoryRows[isHistory].payment_end_date}
              repetition={sortedHistoryRows[isHistory].payment_repetition}
              repetition_type={sortedHistoryRows[isHistory].payment_repetition_type}
              repetition_settings={
                sortedHistoryRows[isHistory].payment_repetition_settings
              }
              body={sortedHistoryRows[isHistory].payment_body}
              onClose={handleCloseEditPaymentModal}
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
                  {row.classification_classification_type === "payment" &&
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
                    ? formatAmountCommas(row.classification_amount)
                    : ""}
                </TableCell>
              ) : key === "classification_account_name" ? (
                <TableCell key={key} component="th" scope="row">
                  {row.classification_account_name === null
                    ? ""
                    : row.classification_account_name}
                </TableCell>
              ) : (
                <TableCell key={key} component="th" scope="row">
                  {row.classification_account_name === null
                    ? ""
                    : row.classification_date}
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
      {sortedHistoryRows.length > 0 && (
        <TableRow>
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
                    {sortedHistoryRows.map((historyRow, historyIndex) => (
                      <TableRow
                        key={historyRow.payment_id}
                        sx={{
                          "& > *": {
                            borderBottom: "unset",
                            backgroundColor: isHistoryOpen
                              ? "#f5f5f5"
                              : "transparent",
                          },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {historyRow.payment_repetition === false
                            ? formatDate(historyRow.payment_schedule)
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
                              handleOpenEditPaymentModal(historyIndex)
                            }
                          >
                            {historyRow.payment_category_name !== null
                              ? historyRow.payment_category_name
                              : "なし"}
                          </button>
                        </TableCell>
                        <TableCell>
                          {historyRow.payment_repetition === false
                            ? formatAmountCommas(historyRow.payment_amount)
                            : formatAmountCommas(
                                repetitionAllMoney(historyRow.payment_id)
                              )}
                        </TableCell>
                        <TableCell>{renderRepetition(historyIndex)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              deletePayment(historyRow.payment_id, isHistory)
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
