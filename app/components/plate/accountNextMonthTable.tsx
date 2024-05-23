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
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { paymentEdit } from "@/lib/api/payment-api";
import { classificationEdit } from "@/lib/api/classification-api";
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

// 表の行コンポーネント
export const PaymentRow: React.FC<paymentRowProps> = (props) => {
  const {
    accounts,
    classifications,
    classificationMonthlyAmounts,
    currentMonth,
  } = useContext(moneyContext);

  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isEditClassificationModalOpen, setIsEditClassificationModalOpen] =
    useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

  useEffect(() => {
    const handleClassificationMonthlyAmount = async () => {
      try {
        const shouldCreateNewAmount = classificationMonthlyAmounts.some(
          (classificationMonthlyAmount) =>
            classificationMonthlyAmount.classification_id === row.id &&
            classificationMonthlyAmount.month === currentMonth
        );

        if (!shouldCreateNewAmount) {
          await classificationMonthlyAmountNew(row.id, currentMonth, 0);
          onClassificationUpdate();
        }
      } catch (error) {
        console.error("Failed to new classificationMonthlyAmount:", error);
      }
    };

    handleClassificationMonthlyAmount();
  }, [currentMonth]);

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

  const renderRepetition = (index: number) => {
    const { payment_repetition_type, payment_repetition_settings } =
      row.history[index];
    if (!payment_repetition_type || !payment_repetition_settings) return "";

    if (
      payment_repetition_type === "daily" &&
      payment_repetition_settings[0] === 1
    ) {
      return "毎日";
    } else if (
      payment_repetition_type === "weekly" &&
      payment_repetition_settings[0] === 1
    ) {
      return `毎週 ${payment_repetition_settings.slice(1).join(" ")}`;
    } else if (
      payment_repetition_type === "monthly" &&
      payment_repetition_settings[0] === 1
    ) {
      return "毎月";
    } else if (payment_repetition_settings[0] > 1) {
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

  const calculateNextSchedule = (index: number) => {
    if (row.history[index].payment_repetition && row.history.length > 0) {
      const {
        payment_schedule,
        payment_repetition_type,
        payment_repetition_settings,
      } = row.history[index];

      // 曜日名を整数にマッピングする関数
      const mapDayOfWeekToInt = (dayOfWeek) => {
        switch (dayOfWeek) {
          case "月":
            return 1;
          case "火":
            return 2;
          case "水":
            return 3;
          case "木":
            return 4;
          case "金":
            return 5;
          case "土":
            return 6;
          case "日":
            return 0;
          default:
            return NaN; // 不正な曜日名の場合はNaNを返す
        }
      };

      const date = new Date(payment_schedule);
      const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
      const currentMonth = date.getMonth(); // 予定の日付の月を取得
      const currentYear = date.getFullYear(); // 予定の日付の年を取得
      let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

      switch (payment_repetition_type) {
        case "daily":
          nextSchedule += payment_repetition_settings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
          break;

        case "weekly":
          if (payment_repetition_settings.length > 1) {
            const targetDaysOfWeek = payment_repetition_settings
              .slice(1)
              .map(mapDayOfWeekToInt);
            const currentDayOfWeek = date.getDay(); // 現在の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
            let daysUntilNextSchedule = 1;

            // 現在の曜日が次の予定日の曜日リストに含まれていない場合、次の予定日を計算
            for (let i = 1; i <= 7; i++) {
              const nextDayOfWeek = (currentDayOfWeek + i) % 7; // 翌日の曜日を計算
              if (targetDaysOfWeek.includes(nextDayOfWeek)) {
                daysUntilNextSchedule = i;
                break;
              }
            }

            // 現在の曜日と次の予定日の曜日が同じ場合、次の予定日を1日進めてから計算
            if (daysUntilNextSchedule === 0) {
              date.setDate(date.getDate() + 1);
              daysUntilNextSchedule = 7;
            }

            nextSchedule +=
              (daysUntilNextSchedule +
                (payment_repetition_settings[0] - 1) * 7) *
              24 *
              60 *
              60 *
              1000;
          }
          break;

        case "monthly":
          // 次の予定日の年と月を計算
          let nextYear = currentYear;
          let nextMonth = currentMonth + payment_repetition_settings[0];
          if (nextMonth === 12) {
            nextYear++;
            nextMonth = 0; // 0 は 1 月を表す
          }

          // 次の予定日を計算
          const daysInNextMonth = new Date(
            nextYear,
            nextMonth + 1,
            0
          ).getDate();
          const nextDayOfMonth = Math.min(date.getDate(), daysInNextMonth);
          const nextDate = new Date(nextYear, nextMonth, nextDayOfMonth);
          nextSchedule = nextDate.getTime();
          break;

        default:
          break;
      }

      // 次の予定日を Date オブジェクトに変換して返す
      return new Date(nextSchedule);
    } else return "";
  };

  const nextSchedule = (index: number) => {
    return calculateNextSchedule(index);
  };

  const handlePaymentDelete = async (id: string, index: number) => {
    const selectedClassification = classifications.find(
      (classification) => classification.id === row.id
    );
    const selectedClassificationMonthlyAmount =
      classificationMonthlyAmounts.find(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id === row.id &&
          classificationMonthlyAmount.month === currentMonth
      );
    try {
      if (row.classification_name === "分類なし") {
        onPaymentDelete(id);
      } else {
        if (selectedClassification && selectedClassificationMonthlyAmount) {
          const editedClassificationAmount =
            parseFloat(String(selectedClassification.amount)) -
            parseFloat(String(row.history[index].payment_amount));

          await classificationEdit(
            selectedClassification.id,
            selectedClassification.account_id,
            selectedClassification.name,
            editedClassificationAmount,
            "payment"
          );
          await classificationMonthlyAmountEdit(
            selectedClassificationMonthlyAmount.id,
            selectedClassificationMonthlyAmount.classification_id,
            selectedClassificationMonthlyAmount.month,
            editedClassificationAmount
          );

          const editedClassification = {
            id: selectedClassification.id,
            account_id: selectedClassification.account_id,
            account_name: selectedClassification.account_name,
            name: selectedClassification.name,
            amount: editedClassificationAmount,
            classification_type: "payment",
          };

          onClassificationUpdate();
          onPaymentDelete(id);
        }
      }
    } catch (error) {
      console.error("Failed to edit payment:", error);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 605 }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>           
                <TableCell>
                 `口座　${currentMonth.slice(1,3)}`
                </TableCell>
                {}
            </TableRow>
          </TableHead>
          <TableBody>
            {filter === "payment"
              ? sortedAllRows.map((row) => (
                  <PaymentRow
                    key={row.id}
                    row={row}
                    visibleColumns={visibleColumns}
                    onPaymentUpdate={updatePayment}
                    onClassificationUpdate={updateClassification}
                    onPaymentDelete={deleteData}
                    onClassificationDelete={deleteClassification}
                  />
                ))
              : filter === "income"
              ? sortedAllRows.map((row) => (
                  <IncomeRow
                    key={row.id}
                    row={row}
                    visibleColumns={visibleColumns}
                    onIncomeUpdate={updateIncome}
                    onClassificationUpdate={updateClassification}
                    onIncomeDelete={deleteData}
                    onClassificationDelete={deleteClassification}
                  />
                ))
              : sortedRows.map((row) => (
                  <AccountRow
                    key={row.id}
                    row={row}
                    visibleColumns={visibleColumns}
                    onAccountUpdate={updateAccount}
                    onTransferUpdate={updateTransfer}
                    onAccountDelete={deleteData}
                    onTransferDelete={deleteTransfer}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableRow>
        <TableCell>口座</TableCell>
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
                          )
                      )
                    : ""}
                </TableCell>
              ) : (
                <TableCell key={key} component="th" scope="row">
                  {String(row[key as keyof displayPaymentData])}
                </TableCell>
              )}
            </>
          ) : null
        )}
        <TableCell align="right">
          <IconButton onClick={() => onClassificationDelete(row.id)}>
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
                          {formatDate(historyRow.payment_schedule)}
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
                          {formatAmountCommas(historyRow.payment_amount)}
                        </TableCell>
                        <TableCell>
                          {renderRepetition(historyIndex)}
                          {historyRow.payment_repetition === true && (
                            <Typography>
                              次回の予定：
                              {formatDate(nextSchedule(historyIndex))}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              handlePaymentDelete(
                                historyRow.payment_id,
                                historyIndex
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
