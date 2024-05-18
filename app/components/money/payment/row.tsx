"use client";
import React, { useState, useContext } from "react";
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

import { paymentEdit } from "@/lib/api/payment-api";

import {
  paymentRowProps,
  displayPaymentData,
} from "@/interface/Payment-interface";

// import { PaymentShow } from "@/components/money/Payment/show";
// import { TransferShow } from "@/components/money/transfer/show";

// 表の行コンポーネント
export const PaymentRow: React.FC<paymentRowProps> = (props) => {
  const {
    row,
    visibleColumns,
    onPaymentUpdate,
    // onTransferUpdate,
    onPaymentDelete,
    // onTransferDelete,
  } = props;
  const { payments } = useContext(moneyContext);

  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isEditTransferModalOpen, setIsEditTransferModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

  const handleOpenEditPaymentModal = () => {
    setIsEditPaymentModalOpen(true);
  };

  const handleCloseEditPaymentModal = () => {
    setIsEditPaymentModalOpen(false);
  };

  const handleOpenEditTransferModal = (index: number) => {
    setIsEditTransferModalOpen(true);
    setIsHistory(index);
  };

  const handleCloseEditTransferModal = () => {
    setIsEditTransferModalOpen(false);
    setIsHistory(0);
  };

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    console.log(typeof integerPart);
    console.log(integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    console.log(
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        decimalPart +
        "円"
    );
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
    const { transfer_repetition_type, transfer_repetition_settings } =
      row.history[index];
    if (!transfer_repetition_type || !transfer_repetition_settings) return "";

    if (
      transfer_repetition_type === "daily" &&
      transfer_repetition_settings[0] === 1
    ) {
      return "毎日";
    } else if (
      transfer_repetition_type === "weekly" &&
      transfer_repetition_settings[0] === 1
    ) {
      return `毎週 ${transfer_repetition_settings.slice(1).join(" ")}`;
    } else if (
      transfer_repetition_type === "monthly" &&
      transfer_repetition_settings[0] === 1
    ) {
      return "毎月";
    } else if (transfer_repetition_settings[0] > 1) {
      return `毎${transfer_repetition_settings[0]}${
        transfer_repetition_type === "daily"
          ? "日"
          : transfer_repetition_type === "weekly"
          ? `週 ${transfer_repetition_settings.slice(1).join(" ")}`
          : "月"
      }`;
    } else {
      return "";
    }
  };

  const calculateNextSchedule = (index: number) => {
    if (row.history[index].transfer_repetition && row.history.length > 0) {
      const {
        transfer_schedule,
        transfer_repetition_type,
        transfer_repetition_settings,
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

      const date = new Date(transfer_schedule);
      const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
      const currentMonth = date.getMonth(); // 予定の日付の月を取得
      const currentYear = date.getFullYear(); // 予定の日付の年を取得
      let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

      switch (transfer_repetition_type) {
        case "daily":
          nextSchedule += transfer_repetition_settings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
          break;

        case "weekly":
          if (transfer_repetition_settings.length > 1) {
            const targetDaysOfWeek = transfer_repetition_settings
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
                (transfer_repetition_settings[0] - 1) * 7) *
              24 *
              60 *
              60 *
              1000;
          }
          break;

        case "monthly":
          // 次の予定日の年と月を計算
          let nextYear = currentYear;
          let nextMonth = currentMonth + transfer_repetition_settings[0];
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

  const handleTransferDelete = async (id: string, index: number) => {
    const selectedBeforePayment = payments.find(
      (payment) => payment.id === row.history[index].transfer_before_payment_id
    );
    const selectedAfterPayment = payments.find(
      (payment) => payment.id === row.history[index].transfer_after_payment_id
    );
    try {
      if (selectedBeforePayment && selectedAfterPayment) {
        const beforePaymentEditedAmount =
          parseFloat(String(selectedBeforePayment.amount)) +
          parseFloat(String(row.history[index].transfer_amount));
        const afterPaymentEditedAmount =
          parseFloat(String(selectedAfterPayment.amount)) -
          parseFloat(String(row.history[index].transfer_amount));

        console.log(selectedBeforePayment);
        console.log(beforePaymentEditedAmount);
        console.log(selectedAfterPayment);
        console.log(afterPaymentEditedAmount);

        await paymentEdit(
          selectedBeforePayment.id,
          selectedBeforePayment.name,
          beforePaymentEditedAmount,
          selectedBeforePayment.body
        );
        await paymentEdit(
          selectedAfterPayment.id,
          selectedAfterPayment.name,
          afterPaymentEditedAmount,
          selectedAfterPayment.body
        );

        const editedBeforePayment = {
          id: selectedBeforePayment.id,
          name: selectedBeforePayment.name,
          amount: beforePaymentEditedAmount,
          body: selectedBeforePayment.body,
        };
        const editedAfterPayment = {
          id: selectedAfterPayment.id,
          name: selectedAfterPayment.name,
          amount: afterPaymentEditedAmount,
          body: selectedAfterPayment.body,
        };

        onPaymentUpdate(editedBeforePayment);
        onPaymentUpdate(editedAfterPayment);
        onTransferDelete(id);
      }
    } catch (error) {
      console.error("Failed to edit payment:", error);
    }
  };

  return (
    <React.Fragment>
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
            <classificationShow
              id={row.id}
              name={row.payment_name}
              amount={row.payment_amount}
              body={row.payment_body}
              onUpdate={onPaymentUpdate}
              onClose={handleCloseEditPaymentModal}
              onDelete={onPaymentDelete}
            />
          </div>
        </div>
      )}

      {isEditTransferModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditTransferModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <PaymentShow
              id={row.history[isHistory].transfer_id}
              before_payment_id={
                row.history[isHistory].transfer_before_payment_id
              }
              after_payment_name={
                row.history[isHistory].transfer_after_payment_name
              }
              after_payment_id={
                row.history[isHistory].transfer_after_payment_id
              }
              amount={row.history[isHistory].transfer_amount}
              schedule={row.history[isHistory].transfer_schedule}
              repetition={row.history[isHistory].transfer_repetition}
              repetition_type={row.history[isHistory].transfer_repetition_type}
              repetition_settings={
                row.history[isHistory].transfer_repetition_settings
              }
              body={row.history[isHistory].transfer_body}
              onPaymentUpdate={onPaymentUpdate}
              onTransferUpdate={onTransferUpdate}
              onClose={handleCloseEditTransferModal}
              onDelete={handleTransferDelete}
            />
          </div>
        </div>
      )}

      <TableRow
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
            <TableCell key={key} component="th" scope="row">
              {key === "classification_name" ? (
                <button
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleOpenEditPaymentModal}
                >
                  {row.classification_name}
                </button>
              ) : key === "classification_amount" ? (
                formatAmountCommas(row.classification_amount)
              ) : (
                String(row[key as keyof displayPaymentData])
              )}
            </TableCell>
          ) : null
        )}
        <TableCell align="right">
          <IconButton onClick={() => onPaymentDelete(row.id)}>
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
                              handleOpenEditTransferModal(historyIndex)
                            }
                          >
                            {historyRow.payment_category_name}
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
                              handleTransferDelete(
                                historyRow.transfer_id,
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
