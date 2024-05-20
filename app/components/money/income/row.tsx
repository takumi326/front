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

import { incomeEdit } from "@/lib/api/income-api";
import { classificationEdit } from "@/lib/api/classification-api";

import {
  incomeRowProps,
  displayIncomeData,
} from "@/interface/Income-interface";

import { IncomeShow } from "@/components/money/income/show";
import { ClassificationShow } from "@/components/money/classification/show";

// 表の行コンポーネント
export const IncomeRow: React.FC<incomeRowProps> = (props) => {
  const {
    row,
    visibleColumns,
    onIncomeUpdate,
    onClassificationUpdate,
    onIncomeDelete,
    onClassificationDelete,
  } = props;
  const { classifications } = useContext(moneyContext);

  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [isEditClassificationModalOpen, setIsEditClassificationModalOpen] =
    useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

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
    const { income_repetition_type, income_repetition_settings } =
      row.history[index];
    if (!income_repetition_type || !income_repetition_settings) return "";

    if (
      income_repetition_type === "daily" &&
      income_repetition_settings[0] === 1
    ) {
      return "毎日";
    } else if (
      income_repetition_type === "weekly" &&
      income_repetition_settings[0] === 1
    ) {
      return `毎週 ${income_repetition_settings.slice(1).join(" ")}`;
    } else if (
      income_repetition_type === "monthly" &&
      income_repetition_settings[0] === 1
    ) {
      return "毎月";
    } else if (income_repetition_settings[0] > 1) {
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

  const calculateNextSchedule = (index: number) => {
    if (row.history[index].income_repetition && row.history.length > 0) {
      const {
        income_schedule,
        income_repetition_type,
        income_repetition_settings,
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

      const date = new Date(income_schedule);
      const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
      const currentMonth = date.getMonth(); // 予定の日付の月を取得
      const currentYear = date.getFullYear(); // 予定の日付の年を取得
      let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

      switch (income_repetition_type) {
        case "daily":
          nextSchedule += income_repetition_settings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
          break;

        case "weekly":
          if (income_repetition_settings.length > 1) {
            const targetDaysOfWeek = income_repetition_settings
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
                (income_repetition_settings[0] - 1) * 7) *
              24 *
              60 *
              60 *
              1000;
          }
          break;

        case "monthly":
          // 次の予定日の年と月を計算
          let nextYear = currentYear;
          let nextMonth = currentMonth + income_repetition_settings[0];
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

  const handleIncomeDelete = async (id: string, index: number) => {
    const selectedClassification = classifications.find(
      (classification) => classification.id === row.id
    );
    try {
      if (selectedClassification) {
        const editedClassificationAmount =
          parseFloat(String(selectedClassification.amount)) -
          parseFloat(String(row.history[index].income_amount));

        await classificationEdit(
          selectedClassification.id,
          selectedClassification.account_id,
          selectedClassification.name,
          editedClassificationAmount,
          "income"
        );

        const editedClassification = {
          id: selectedClassification.id,
          account_id: selectedClassification.account_id,
          account_name: selectedClassification.account_name,
          name: selectedClassification.name,
          amount: editedClassificationAmount,
          classification_type: "income",
        };

        onClassificationUpdate(editedClassification);
        onIncomeDelete(id);
      }
    } catch (error) {
      console.error("Failed to edit income:", error);
    }
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
              amount={row.classification_amount}
              classification_type={"income"}
              onUpdate={onClassificationUpdate}
              onClose={handleCloseEditClassificationModal}
              onDelete={onClassificationDelete}
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
              category_name={row.history[isHistory].income_category_name}
              classification_id={
                row.history[isHistory].income_classification_id
              }
              classification_name={
                row.history[isHistory].income_classification_name
              }
              amount={row.history[isHistory].income_amount}
              schedule={row.history[isHistory].income_schedule}
              repetition={row.history[isHistory].income_repetition}
              repetition_type={row.history[isHistory].income_repetition_type}
              repetition_settings={
                row.history[isHistory].income_repetition_settings
              }
              body={row.history[isHistory].income_body}
              onIncomeUpdate={onIncomeUpdate}
              onClassificationUpdate={onClassificationUpdate}
              onClose={handleCloseEditIncomeModal}
              onIncomeDelete={handleIncomeDelete}
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
                    ? formatAmountCommas(row.classification_amount)
                    : ""}
                </TableCell>
              ) : (
                <TableCell key={key} component="th" scope="row">
                  {String(row[key as keyof displayIncomeData])}
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
                      <TableRow key={historyRow.income_id}>
                        <TableCell component="th" scope="row">
                          {formatDate(historyRow.income_schedule)}
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
                          {formatAmountCommas(historyRow.income_amount)}
                        </TableCell>
                        <TableCell>
                          {renderRepetition(historyIndex)}
                          {historyRow.income_repetition === true && (
                            <Typography>
                              次回の予定：
                              {formatDate(nextSchedule(historyIndex))}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              handleIncomeDelete(
                                historyRow.income_id,
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
