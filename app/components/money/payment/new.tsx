"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";

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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { moneyContext } from "@/context/money-context";

import { repetitionMoneyNew } from "@/lib/api/repetitionMoney-api";
import { paymentNew } from "@/lib/api/payment-api";
import { classificationMonthlyAmountEdit } from "@/lib/api/classificationMonthlyAmount-api";

import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";
import { paymentNewProps } from "@/interface/payment-interface";
import { classificationMonthlyAmountData } from "@/lib/api/classification-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const PaymentNew: React.FC<paymentNewProps> = (props) => {
  const { onClose } = props;
  const {
    classifications,
    categories,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
  } = useContext(moneyContext);
  const initialDateObject = new Date().toLocaleDateString().split("T")[0];
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();

  const [repetitionDialogOpen, setRepetitionDialogOpen] =
    useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [period, setPeriod] = useState("");

  const [newCategoryId, setNewCategoryId] = useState("");
  const [newClassificationId, setNewClassificationId] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newAmountString, setNewAmountString] = useState("0");
  const [newAmountError, setNewAmountError] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState(initialDateObject);
  const [newMonth, setNewMonth] = useState(
    `${new Date().getFullYear()}${new Date().getMonth() + 1}`
  );
  const [newEndDate, setNewEndDate] = useState(endDateObject);
  const [newRepetition, setNewRepetition] = useState<boolean>(false);
  const [newRepetitionType, setNewRepetitionType] = useState("");
  const [newRepetitionSettings, setNewRepetitionSettings] = useState<string[]>(
    []
  );
  const [newBody, setNewBody] = useState("");
  const [isClassificationFormValid, setIsClassificationFormValid] =
    useState(true);
  const [isCategoryFormValid, setIsCategoryFormValid] = useState(true);

  useEffect(() => {
    if (newAmount > 0) {
      setNewAmountError(false);
    } else {
      setNewAmountError(true);
    }
  }, [newAmount]);

  const newPayment = async () => {
    try {
      const response = await paymentNew(
        newCategoryId,
        newClassificationId,
        newAmount,
        newSchedule,
        newEndDate,
        newRepetition,
        newRepetitionType,
        newRepetitionSettings,
        newBody
      );

      if (newRepetition === false) {
        const selectedClassificationMonthlyAmount: classificationMonthlyAmountData =
          classificationMonthlyAmounts.find(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
                newClassificationId &&
              classificationMonthlyAmount.month === newMonth
          );

        const editedClassificationAmount =
          parseFloat(String(selectedClassificationMonthlyAmount.amount)) +
          parseFloat(String(newAmount));

        if (selectedClassificationMonthlyAmount) {
          await classificationMonthlyAmountEdit(
            selectedClassificationMonthlyAmount.id,
            selectedClassificationMonthlyAmount.classification_id,
            selectedClassificationMonthlyAmount.schedule,
            editedClassificationAmount
          );
        }
      } else {
        let repetitionMoneyDate: repetitionMoneyData[] = [];
        const schedules = calculateNextSchedules();

        await Promise.all(
          schedules.map(async (schedule) => {
            const stringDate = new Date(schedule)
              .toLocaleDateString()
              .split("T")[0];
            const repetitionMoney = await repetitionMoneyNew(
              "payment",
              response.id,
              "",
              "",
              newAmount,
              stringDate
            );
            repetitionMoneyDate = [...repetitionMoneyDate, repetitionMoney];
          })
        );

        for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
          (classificationMonthlyAmount) =>
            classificationMonthlyAmount.classification_id ===
            newClassificationId
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

          for (const repetitionMoney of repetitionMoneyDate.filter(
            (repetitionMoney) =>
              new Date(repetitionMoney.repetition_schedule).getTime() >=
                start.getTime() &&
              new Date(repetitionMoney.repetition_schedule).getTime() <=
                end.getTime()
          )) {
            money += parseFloat(String(repetitionMoney.amount));
          }

          await classificationMonthlyAmountEdit(
            classificationMonthlyAmount.id,
            classificationMonthlyAmount.classification_id,
            classificationMonthlyAmount.month,
            money
          );
        }
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        setNewAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setNewAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "body":
        setNewBody(value);
        break;
      default:
        break;
    }
  };

  const handleClassificationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setNewClassificationId(value);
    setIsClassificationFormValid(false);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setNewCategoryId(value);
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
      newRepetitionSettings && newRepetitionSettings[0]
        ? Number(newRepetitionSettings[0])
        : 1
    );
    setSelectedDays(
      newRepetitionSettings && newRepetitionSettings.length > 1
        ? newRepetitionSettings.slice(1)
        : []
    );
    setPeriod(newRepetitionType ? newRepetitionType : "");
  };

  const handleRepetitionDialogDelete = () => {
    setRepetitionDialogOpen(false);
    setNewRepetition(false);
    setNewRepetitionType("");
    setNewRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("");
  };

  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setNewRepetition(true);
    setNewRepetitionType(period);
    setNewRepetitionSettings([frequency.toString(), ...selectedDays]);
  };

  const handleSchedulChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    const StringMonth = `${date.getFullYear()}${date.getMonth() + 1}`;
    setNewSchedule(stringDate);
    setNewMonth(StringMonth);
  };

  const handleEndDateChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      stringDate = endDateObject;
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }
    setNewEndDate(stringDate);
  };

  const handleSave = () => {
    newPayment();
    onClose();
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

    const startDate = new Date(newSchedule);
    const endDate = new Date(newEndDate);
    endDate.setHours(23, 59, 59, 999);
    let schedules = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      schedules.push(new Date(currentDate).toLocaleDateString().split("T")[0]);

      switch (newRepetitionType) {
        case "daily":
          currentDate.setDate(
            currentDate.getDate() + Number(newRepetitionSettings[0])
          );
          break;

        case "weekly":
          const targetDaysOfWeek = newRepetitionSettings
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
            currentDate.getMonth() + Number(newRepetitionSettings[0]);
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

  return (
    <Box width={560} height={810}>
      <Dialog
        open={repetitionDialogOpen}
        onClose={handleRepetitionDialogCancel}
        fullWidth
        maxWidth="xs"
      >
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

      <ul className="w-full">
        <li className="pt-5">
          <Typography variant="subtitle1">分類</Typography>
          <Select
            fullWidth
            value={newClassificationId}
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
            value={newCategoryId}
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
              value={newAmountString}
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
          {newAmountError && (
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
            {newRepetition === true ? (
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
            {newRepetitionSettings && (
              <>
                {newRepetitionType === "daily" &&
                  Number(newRepetitionSettings[0]) === 1 &&
                  `毎日`}
                {newRepetitionType === "weekly" &&
                  Number(newRepetitionSettings[0]) === 1 &&
                  `毎週 ${newRepetitionSettings.slice(1).join(" ")}`}
                {newRepetitionType === "monthly" &&
                  Number(newRepetitionSettings[0]) === 1 &&
                  `毎月`}
                {Number(newRepetitionSettings[0]) > 1 &&
                  newRepetitionSettings &&
                  `毎${newRepetitionSettings[0]}${
                    newRepetitionType === "daily"
                      ? "日"
                      : newRepetitionType === "weekly"
                      ? `週 ${newRepetitionSettings.slice(1).join(" ")}`
                      : "月"
                  }`}
              </>
            )}
          </Typography>
        </li>
        <li className="pt-5">
          {newRepetition === true ? (
            <Typography variant="subtitle1">繰り返し開始日</Typography>
          ) : (
            <Typography variant="subtitle1">予定</Typography>
          )}
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              borderWidth: "px",
            }}
          >
            <InputDateTime
              selectedDate={newSchedule}
              onChange={handleSchedulChange}
            />
          </Box>
        </li>
        {newRepetition === true && (
          <li className="pt-5">
            <Typography variant="subtitle1">繰り返し終了日</Typography>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                borderWidth: "px",
              }}
            >
              <InputDateTime
                selectedDate={newEndDate}
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
            value={newBody}
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
                newAmountError
              }
              color="primary"
            >
              作成
            </Button>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
