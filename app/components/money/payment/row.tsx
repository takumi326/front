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

import { PaymentShow } from "@/components/money/payment/show";
import { ClassificationShow } from "@/components/money/classification/show";

export const PaymentRow: React.FC<paymentRowProps> = (props) => {
  const { row, start, end, visibleColumns } = props;
  const {
    repetitionMoneies,
    payments,
    classificationMonthlyAmounts,
    currentMonth,
    isEditing,
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
        const shouldCreateNewAmount = classificationMonthlyAmounts.some(
          (classificationMonthlyAmount) =>
            classificationMonthlyAmount.classification_id === row.id &&
            classificationMonthlyAmount.month === currentMonth
        );
        let money = 0;
        if (!shouldCreateNewAmount) {
          row.history.map((historyRow) => {
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
          await classificationMonthlyAmountNew(row.id, currentMonth, money);
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

  const deletePayment = async (id: string) => {
    try {
      await paymentDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const handlePaymentDelete = async (id: string) => {
    try {
      if (row.classification_name === "分類なし") {
        deletePayment(id);
      } else {
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
            money
          );

          deletePayment(id);
          setIsEditing(true);
        }
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
      row.history[index];
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
              date={row.classification_date}
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
              id={row.history[isHistory].payment_id}
              category_id={row.history[isHistory].payment_category_id}
              classification_id={
                row.history[isHistory].payment_classification_id
              }
              amount={row.history[isHistory].payment_amount}
              schedule={row.history[isHistory].payment_schedule}
              end_date={row.history[isHistory].payment_end_date}
              repetition={row.history[isHistory].payment_repetition}
              repetition_type={row.history[isHistory].payment_repetition_type}
              repetition_settings={
                row.history[isHistory].payment_repetition_settings
              }
              body={row.history[isHistory].payment_body}
              onClose={handleCloseEditPaymentModal}
              onPaymentDelete={handlePaymentDelete}
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
              ) : (
                <TableCell key={key} component="th" scope="row">
                  {row[key as keyof displayPaymentData] === null
                    ? ""
                    : String(row[key as keyof displayPaymentData])}
                </TableCell>
              )}
            </>
          ) : null
        )}
        <TableCell align="right">
          <IconButton onClick={() => deleteClassification(row.id)}>
            <DeleteIcon />
          </IconButton>
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
                      <TableRow key={historyRow.payment_id}>
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
                              handlePaymentDelete(historyRow.payment_id)
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
