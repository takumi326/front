"use client";
import React, { useState, ChangeEvent, useContext, useEffect } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import {
  repetitionMoneyNew,
  repetitionMoneyDelete,
} from "@/lib/api/repetitionMoney-api";
import { paymentEdit, paymentDelete } from "@/lib/api/payment-api";
import { classificationMonthlyAmountEdit } from "@/lib/api/classificationMonthlyAmount-api";

import { paymentShowProps } from "@/interface/payment-interface";
import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";
import { classificationMonthlyAmountData } from "@/lib/api/classification-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";
import { RepetitionMoneyRow } from "@/components/money/repetitionMoney/row";

export const PaymentShow: React.FC<paymentShowProps> = (props) => {
  const {
    id,
    category_id,
    classification_id,
    amount,
    schedule,
    end_date,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    onClose,
    onPaymentDelete,
  } = props;
  const {
    repetitionMoneies,
    classifications,
    categories,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
  } = useContext(moneyContext);
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();

  const [repetitionDialogOpen, setRepetitionDialogOpen] =
    useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(
    repetition_settings && Number(repetition_settings[0])
      ? Number(repetition_settings[0])
      : 1
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    repetition_settings && repetition_settings.length > 1
      ? repetition_settings.slice(1)
      : []
  );
  const [period, setPeriod] = useState(repetition_type ? repetition_type : "");

  const initialClassificationId = classification_id;
  const initialAmount = amount;
  const initialRepetiion = repetition;

  const [editCategoryId, setEditCategoryId] = useState(category_id);
  const [editClassificationId, setEditClassificationId] =
    useState(classification_id);
  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState(schedule);
  const [editMonth, setEditMonth] = useState(
    `${new Date(schedule).getFullYear()}${new Date(schedule).getMonth() + 1}`
  );
  const [editEndDate, setEditEndDate] = useState(end_date);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState<string[]>(repetition_settings);
  const [editBody, setEditBody] = useState(body);
  const [isClassificationFormValid, setIsClassificationFormValid] = useState(
    editClassificationId ? false : true
  );
  const [isCategoryFormValid, setIsCategoryFormValid] = useState(
    editCategoryId ? false : true
  );

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }
  }, [editAmount]);

  const editPayment = async (id: string) => {
    try {
      if (initialClassificationId != null) {
        if (initialRepetiion === true) {
          await Promise.all(
            repetitionMoneies
              .filter((repetitionMoney) => repetitionMoney.payment_id === id)
              .map((repetitionMoney) =>
                repetitionMoneyDelete(repetitionMoney.id)
              )
          );

          if (initialClassificationId !== null) {
            for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                initialClassificationId
            )) {
              let money = parseFloat(
                String(classificationMonthlyAmount.amount)
              );
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
              console.log(classificationMonthlyAmount.amount);
              for (const repetitionMoney of repetitionMoneies.filter(
                (repetitionMoney) =>
                  repetitionMoney.transaction_type === "payment" &&
                  repetitionMoney.payment_id === id &&
                  new Date(repetitionMoney.repetition_schedule).getTime() >=
                    start.getTime() &&
                  new Date(repetitionMoney.repetition_schedule).getTime() <=
                    end.getTime()
              )) {
                console.log(repetitionMoney.repetition_schedule);
                console.log(money);
                money -= parseFloat(String(repetitionMoney.amount));
              }
              console.log(money);
              const res = await classificationMonthlyAmountEdit(
                classificationMonthlyAmount.id,
                classificationMonthlyAmount.classification_id,
                classificationMonthlyAmount.month,
                money
              );
              // console.log(res);
            }
          }
        } else {
          const initialClassificationMonthlyAmount: classificationMonthlyAmountData =
            classificationMonthlyAmounts.find(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                  initialClassificationId &&
                classificationMonthlyAmount.month === currentMonth
            );

          const initialClassificationAmount = Math.max(
            0,
            parseFloat(String(initialClassificationMonthlyAmount.amount)) -
              parseFloat(String(initialAmount))
          );

          await classificationMonthlyAmountEdit(
            initialClassificationMonthlyAmount.id,
            initialClassificationMonthlyAmount.classification_id,
            initialClassificationMonthlyAmount.month,
            initialClassificationAmount
          );
        }
      }

      await paymentEdit(
        id,
        editCategoryId,
        editClassificationId,
        editAmount,
        editSchedule,
        editEndDate,
        editRepetition,
        editRepetitionType,
        editRepetitionSettings,
        editBody
      );

      if (editRepetition === true) {
        let repetitionMoneyDate: repetitionMoneyData[] = [];
        const schedules = calculateNextSchedules();

        await Promise.all(
          schedules.map(async (schedule) => {
            const stringDate = new Date(schedule)
              .toLocaleDateString()
              .split("T")[0];
            const repetitionMoney = await repetitionMoneyNew(
              "payment",
              id,
              "",
              "",
              editAmount,
              stringDate
            );
            repetitionMoneyDate = [...repetitionMoneyDate, repetitionMoney];
          })
        );

        for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
          (classificationMonthlyAmount) =>
            classificationMonthlyAmount.classification_id ===
            editClassificationId
        )) {
          console.log(classificationMonthlyAmount.amount);
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

          for (const repetitionMoney of repetitionMoneyDate.filter(
            (repetitionMoney) =>
              new Date(repetitionMoney.repetition_schedule).getTime() >=
                start.getTime() &&
              new Date(repetitionMoney.repetition_schedule).getTime() <=
                end.getTime()
          )) {
            console.log(repetitionMoney.repetition_schedule);
            console.log(money);
            money += parseFloat(String(repetitionMoney.amount));
          }
          console.log(money);
          await classificationMonthlyAmountEdit(
            classificationMonthlyAmount.id,
            classificationMonthlyAmount.classification_id,
            classificationMonthlyAmount.month,
            money
          );
        }
      } else {
        const editClassificationMonthlyAmount: classificationMonthlyAmountData =
          classificationMonthlyAmounts.find(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
                editClassificationId &&
              classificationMonthlyAmount.month === editMonth
          );

        if (editClassificationMonthlyAmount) {
          const editClassificationAmount = Math.max(
            0,
            parseFloat(String(editClassificationMonthlyAmount.amount)) +
              parseFloat(String(initialAmount))
          );

          await classificationMonthlyAmountEdit(
            editClassificationMonthlyAmount.id,
            editClassificationMonthlyAmount.classification_id,
            editClassificationMonthlyAmount.month,
            editClassificationAmount
          );
        }
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit payment:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        setEditAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setEditAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const handleClassificationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditClassificationId(value);
    setIsClassificationFormValid(false);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditCategoryId(value);
    const selectedCategory = categories.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setIsCategoryFormValid(false);
    }
  };

  const handleRepetitionDialogOpen = () => {
    setRepetitionDialogOpen(true);
    setPeriod("daily");
  };

  const handleRepetitionDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setFrequency(
      editRepetitionSettings && Number(editRepetitionSettings[0])
        ? Number(editRepetitionSettings[0])
        : 1
    );
    setSelectedDays(
      editRepetitionSettings && editRepetitionSettings.length > 1
        ? editRepetitionSettings.slice(1)
        : []
    );
    setPeriod(editRepetitionType ? editRepetitionType : "");
  };

  const handleRepetitionDialogDelete = async () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(false);
    setEditRepetitionType("");
    setEditRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("");
    try {
      await Promise.all(
        repetitionMoneies
          .filter((repetitionMoney) => repetitionMoney.payment_id === id)
          .map((repetitionMoney) => repetitionMoneyDelete(repetitionMoney.id))
      );
    } catch (error) {
      console.error("Failed to delete repetitionMoney:", error);
    }
  };
  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(true);
    setEditRepetitionType(period);
    setEditRepetitionSettings([frequency.toString(), ...selectedDays]);
  };

  const handleSchedulChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    const StringMonth = `${date.getFullYear()}${date.getMonth() + 1}`;
    setEditSchedule(stringDate);
    setEditMonth(StringMonth);
  };

  const handleEndDateChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      stringDate = endDateObject;
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }
    setEditEndDate(stringDate);
  };

  const handleSave = () => {
    if (editAmount > 0) {
      editPayment(id);
      onClose();
    } else {
      setEditAmountError(true);
    }
  };

  const handleFrequencyChange = (delta: number) => {
    setFrequency((prev) => Math.max(1, prev + delta));
  };

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: string | null
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      if (newPeriod !== "weekly") {
        setSelectedDays([]);
      }
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev.filter((d) => d !== day), day].sort((a, b) => {
            const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];
            return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
          })
    );
  };

  const calculateNextSchedules = () => {
    const mapDayOfWeekToInt = (dayOfWeek: string) => {
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
          return NaN;
      }
    };

    const startDate = new Date(editSchedule);
    const endDate = new Date(editEndDate);
    endDate.setHours(23, 59, 59, 999);
    let schedules = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      schedules.push(new Date(currentDate).toLocaleDateString().split("T")[0]);

      switch (editRepetitionType) {
        case "daily":
          currentDate.setDate(
            currentDate.getDate() + Number(editRepetitionSettings[0])
          );
          break;

        case "weekly":
          const targetDaysOfWeek = editRepetitionSettings
            .slice(1)
            .map(mapDayOfWeekToInt);
          let currentDayOfWeek = currentDate.getDay();
          let nextDayOfWeek = currentDayOfWeek;

          for (let i = 1; i <= 7; i++) {
            nextDayOfWeek = (currentDayOfWeek + i) % 7;
            if (targetDaysOfWeek.includes(nextDayOfWeek)) {
              currentDate.setDate(currentDate.getDate() + i);
              break;
            }
          }

          if (currentDayOfWeek === nextDayOfWeek) {
            currentDate.setDate(currentDate.getDate() + 7);
          }
          break;

        case "monthly":
          let nextMonth =
            currentDate.getMonth() + Number(editRepetitionSettings[0]);
          let nextYear = currentDate.getFullYear();
          if (nextMonth > 11) {
            nextYear += Math.floor(nextMonth / 12);
            nextMonth = nextMonth % 12;
          }
          const daysInNextMonth = new Date(
            nextYear,
            nextMonth + 1,
            0
          ).getDate();
          currentDate = new Date(
            nextYear,
            nextMonth,
            Math.min(currentDate.getDate(), daysInNextMonth)
          );
          break;

        default:
          return schedules;
      }
    }

    return schedules;
  };

  const isDialogFormValid =
    period === "daily" ||
    period === "monthly" ||
    (period === "weekly" && selectedDays.length > 0);

  const sortedRows = repetitionMoneies
    .filter((repetitionMoney) => repetitionMoney.payment_id === id)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.repetition_schedule).getTime();
      const dateB = new Date(b.repetition_schedule).getTime();
      return dateA - dateB;
    });

  return (
    <Box
      sx={{
        width:
          editRepetition === true &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.payment_id === id
          ).length > 0
            ? 1000
            : 560,
        height: 800,
      }}
    >
      <Dialog
        open={repetitionDialogOpen}
        onClose={handleRepetitionDialogCancel}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "350px",
          },
        }}
      >
        <button
          onClick={handleRepetitionDialogCancel}
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </button>
        <DialogTitle sx={{ textAlign: "center" }}>繰り返しの設定</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => handleFrequencyChange(-1)}>
                <RemoveIcon />
              </IconButton>
              <Typography>{frequency}</Typography>
              <IconButton onClick={() => handleFrequencyChange(1)}>
                <AddIcon />
              </IconButton>
              <ToggleButtonGroup
                value={period}
                exclusive
                onChange={handlePeriodChange}
                aria-label="period"
              >
                <ToggleButton value="daily">日</ToggleButton>
                <ToggleButton value="weekly">週</ToggleButton>
                <ToggleButton value="monthly">月</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {period === "weekly" && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {["月", "火", "水", "木", "金", "土", "日"].map(
                  (day, index) => (
                    <ToggleButton
                      key={day}
                      value={day}
                      selected={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    >
                      {day}
                    </ToggleButton>
                  )
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleRepetitionDialogDelete}
            sx={{
              minWidth: 120,
              border: "1px solid #f44336",
              color: "#f44336",
            }}
          >
            削除
          </Button>
          <Button
            onClick={handleRepetitionSave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={!isDialogFormValid}
          >
            設定
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={5}>
        <ul className="w-full">
          <li className="pt-10">
            <Typography variant="subtitle1">分類</Typography>
            <Select
              fullWidth
              value={editClassificationId}
              onChange={handleClassificationChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {classifications
                .filter(
                  (classification) =>
                    classification.classification_type === "payment"
                )
                .map((classification) => (
                  <MenuItem key={classification.id} value={classification.id}>
                    {classification.name}
                  </MenuItem>
                ))}
            </Select>
            {isClassificationFormValid && (
              <Typography align="left" variant="subtitle1">
                分類を選択してください
              </Typography>
            )}
          </li>
          <li className="pt-5">
            <Typography variant="subtitle1">カテゴリ</Typography>
            <Select
              fullWidth
              value={editCategoryId}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {categories
                .filter((category) => category.category_type === "payment")
                .map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
            {isCategoryFormValid && (
              <Typography align="left" variant="subtitle1">
                カテゴリを選択してください
              </Typography>
            )}
          </li>
          <li className="pt-5">
            <Typography variant="subtitle1">金額</Typography>
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="amount"
                value={editAmountString}
                onChange={handleChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <span>円</span>
            </div>
          </li>
          <li>
            {editAmountError && (
              <Typography align="left" variant="subtitle1">
                金額を0以上にして下さい
              </Typography>
            )}
          </li>
          <li className="pt-5">
            <Stack direction="row" spacing={1}>
              <button
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={handleRepetitionDialogOpen}
              >
                繰り返し
              </button>
              {editRepetition === true ? (
                <Typography align="left" variant="subtitle1">
                  ON
                </Typography>
              ) : (
                <Typography align="left" variant="subtitle1">
                  OFF
                </Typography>
              )}
            </Stack>
            <Typography>
              {editRepetitionSettings && (
                <>
                  {editRepetitionType === "daily" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎日`}
                  {editRepetitionType === "weekly" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎週 ${editRepetitionSettings.slice(1).join(" ")}`}
                  {editRepetitionType === "monthly" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎月`}
                  {Number(editRepetitionSettings[0]) > 1 &&
                    editRepetitionSettings &&
                    `毎${editRepetitionSettings[0]}${
                      editRepetitionType === "daily"
                        ? "日"
                        : editRepetitionType === "weekly"
                        ? `週 ${editRepetitionSettings.slice(1).join(" ")}`
                        : "月"
                    }`}
                </>
              )}
            </Typography>
          </li>
          <li className="pt-5">
            {editRepetition === true ? (
              <Typography variant="subtitle1">繰り返し開始日</Typography>
            ) : (
              <Typography variant="subtitle1">予定</Typography>
            )}
            <Box
              sx={{
                width: 98,
                border: "1px solid #ccc",
                borderRadius: "4px",
                borderWidth: "px",
              }}
            >
              <InputDateTime
                selectedDate={editSchedule}
                onChange={handleSchedulChange}
              />
            </Box>
          </li>
          {editRepetition === true && (
            <li className="pt-5">
              <Typography variant="subtitle1">繰り返し終了日</Typography>
              <Box
                sx={{
                  width: 98,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  borderWidth: "px",
                }}
              >
                <InputDateTime
                  selectedDate={editEndDate}
                  onChange={handleEndDateChange}
                />
              </Box>
              <Typography>※設定できるのは最大で今日から5年後です</Typography>
              <Typography>
                ※設定しない場合は今日から5年後が設定されます
              </Typography>
            </li>
          )}
          <li className="pt-5">
            <Typography variant="subtitle1">備考</Typography>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              name="body"
              value={editBody}
              onChange={handleChange}
            />
          </li>
          <li className="pt-10">
            <Stack direction="row" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={
                  isClassificationFormValid ||
                  isCategoryFormValid ||
                  editAmountError
                }
                color="primary"
                className={
                  editRepetition === true &&
                  repetitionMoneies.filter(
                    (repetitionMoney) => repetitionMoney.payment_id === id
                  ).length > 0
                    ? "ml-48"
                    : "ml-60"
                }
              >
                保存
              </Button>
              <IconButton
                onClick={() => onPaymentDelete(id)}
                className="ml-auto"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </li>
        </ul>
        {editRepetition === true &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.payment_id === id
          ).length > 0 && (
            <div className="w-full pt-10">
              <Typography variant="subtitle1">繰り返し一覧</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 635 }}>
                <Table stickyHeader size="small" aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>金額</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRows.map((repetitionMoney) => (
                      <RepetitionMoneyRow
                        key={repetitionMoney.id}
                        id={repetitionMoney.id}
                        amount={repetitionMoney.amount}
                        repetition_schedule={
                          repetitionMoney.repetition_schedule
                        }
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
      </Stack>
    </Box>
  );
};
