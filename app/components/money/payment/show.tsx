"use client";
import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import moment from "moment";

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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { moneyContext } from "@/context/money-context";

import {
  repetitionMoneyEdit,
  repetitionMoneyNew,
  repetitionMoneyDelete,
} from "@/lib/api/repetitionMoney-api";
import { paymentEdit } from "@/lib/api/payment-api";
// import { classificationEdit } from "@/lib/api/classification-api";
import { classificationMonthlyAmountEdit } from "@/lib/api/classificationMonthlyAmount-api";

import { paymentShowProps } from "@/interface/payment-interface";
import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";
import { classificationMonthlyAmountData } from "@/lib/api/classification-api";

export const PaymentShow: React.FC<paymentShowProps> = (props) => {
  const {
    id,
    category_id,
    classification_id,
    classification_name,
    amount,
    schedule,
    end_date,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    onClose,
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
  const [initialClassificationAccountId, setInitialClassificationAccountId] =
    useState("");
  const initialClassificationName = classification_name;
  const [initialClassificationAmount, setInitialClassificationAmount] =
    useState<number>(0);
  const initialAmount = amount;
  const initialRepetiion = repetition;

  const [editCategoryId, setEditCategoryId] = useState(category_id);

  const [editClassificationId, setEditClassificationId] =
    useState(classification_id);
  const [editClassificationAccountId, setEditClassificationAccountId] =
    useState("");
  const [editClassificationName, setEditClassificationName] =
    useState(classification_name);

  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState(schedule);
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
    const selectedClassification = classifications.find(
      (classification) => classification.id === initialClassificationId
    );
    if (selectedClassification) {
      setInitialClassificationAccountId(selectedClassification.account_id);
      setEditClassificationAccountId(selectedClassification.account_id);
    }
  }, []);

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }
  }, [editAmount]);

  const editPayment = async (id: string) => {
    const selectednewClassificationMonthlyAmount: classificationMonthlyAmountData =
      classificationMonthlyAmounts.find(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id ===
            editClassificationId &&
          classificationMonthlyAmount.month === currentMonth
      );

    try {
      if (initialRepetiion === true) {
        await Promise.all(
          repetitionMoneies
            .filter((repetitionMoney) => repetitionMoney.payment_id === id)
            .map((repetitionMoney) => repetitionMoneyDelete(repetitionMoney.id))
        );
        if (initialClassificationId !== null) {
          for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
              initialClassificationId
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
          }
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
//場合分け
//initialClassificationId、editClassificationId、editRepetition 、initialRepetition 
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

      } else {
        if (initialClassificationId !== editClassificationId) {
          const oldClassificationAmount = Math.max(
            0,
            parseFloat(String(initialClassificationAmount)) -
              parseFloat(String(initialAmount))
          );
          const newClassificationAmount = Math.max(
            0,
            parseFloat(String(selectednewClassificationMonthlyAmount.amount)) +
              parseFloat(String(editAmount))
          );

          if (editRepetition === true) {
            const schedules = calculateNextSchedules();

            await Promise.all(
              schedules.map(async (schedule) => {
                const stringDate = new Date(schedule)
                  .toLocaleDateString()
                  .split("T")[0];
                await repetitionMoneyNew(
                  "payment",
                  id,
                  "",
                  "",
                  editAmount,
                  stringDate
                );
              })
            );
          } else {
            let repetitionMoneies: repetitionMoneyData[] = [];
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
                repetitionMoneies = [...repetitionMoneies, repetitionMoney];
              })
            );

            for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                newClassificationId
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

              for (const repetitionMoney of repetitionMoneies.filter(
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
        } else if (initialClassificationName === editClassificationName) {
          const newClassificationAmount = Math.max(
            0,
            parseFloat(String(editClassificationAmount)) -
              parseFloat(String(initialAmount)) +
              parseFloat(String(editAmount))
          );

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

          await classificationMonthlyAmountEdit(
            selectednewClassificationMonthlyAmount.id,
            selectednewClassificationMonthlyAmount.classification_id,
            selectednewClassificationMonthlyAmount.month,
            newClassificationAmount
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
    const selectedClassification = classifications.find(
      (classification) => classification.id === value
    );
    if (selectedClassification) {
      setEditClassificationAccountId(selectedClassification.account_id);
      // setEditClassificationAccountName(selectedClassification.account_name);
      setEditClassificationName(selectedClassification.name);
      // setEditClassificationAmount(selectedClassification.amount);
    } else {
      setEditClassificationAccountId("");
      // setEditClassificationAccountName("");
      setEditClassificationName("");
      // setEditClassificationAmount(0);
    }
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
    // const selectedCategory = categories.find(
    //   (category) => category.id === value
    // );
    // if (selectedCategory) {
    //   setEditCategoryName(selectedCategory.name);
    // } else {
    //   setEditCategoryName("");
    // }
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
    setEditSchedule(stringDate);
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
  // const nextSchedule = calculateNextSchedule();

  // const formatDate = (date: Date | undefined): string => {
  //   if (!date) return ""; // 日付が未定義の場合は空文字を返す

  //   return moment(date).format("MM/DD/YY");
  // };

  const isDialogFormValid =
    period === "daily" ||
    period === "monthly" ||
    (period === "weekly" && selectedDays.length > 0);

  return (
    <Box width={560} height={830}>
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
            >
              保存
            </Button>
          </Stack>
          <IconButton
            // onClick={() => onDelete(id)}
            className="absolute right-0 bottom-0 m-8"
          >
            <DeleteIcon />
          </IconButton>
        </li>
      </ul>
    </Box>
  );
};
