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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { moneyContext } from "@/context/money-context";

import { incomeEdit } from "@/lib/api/income-api";
import { classificationEdit } from "@/lib/api/classification-api";

import { incomeShowProps } from "@/interface/income-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const IncomeShow: React.FC<incomeShowProps> = (props) => {
  const {
    id,
    category_id,
    category_name,
    classification_id,
    classification_name,
    amount,
    schedule,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    onIncomeUpdate,
    onClassificationUpdate,
    onClose,
    onIncomeDelete,
  } = props;
  const { classifications, categories } = useContext(moneyContext);

  const [repetitionDialogOpen, setRepetitionDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState(
    repetition_settings && repetition_settings[0] ? repetition_settings[0] : 1
  );
  const [selectedDays, setSelectedDays] = useState(
    repetition_settings && repetition_settings.length > 1
      ? repetition_settings.slice(1)
      : []
  );
  const [period, setPeriod] = useState(repetition_type ? repetition_type : "");

  const initialClassificationId = classification_id;
  const [initialClassificationAccountId, setInitialClassificationAccountId] =
    useState("");
  const [
    initialClassificationAccountName,
    setInitialClassificationAccountName,
  ] = useState("");
  const initialClassificationName = classification_name;
  const [initialClassificationAmount, setInitialClassificationAmount] =
    useState<number>(0);
  const initialAmount = amount;

  const [editCategoryId, setEditCategoryId] = useState(category_id);
  const [editCategoryName, setEditCategoryName] = useState(category_name);

  const [editClassificationId, setEditClassificationId] =
    useState(classification_id);
  const [editClassificationAccountId, setEditClassificationAccountId] =
    useState("");
  const [editClassificationAccountName, setEditClassificationAccountName] =
    useState("");
  const [editClassificationName, setEditClassificationName] =
    useState(classification_name);
  const [editClassificationAmount, setEditClassificationAmount] =
    useState<number>(0);

  const [editAmount, setEditAmount] = useState(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState<Date>(schedule);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState(repetition_settings);
  const [editBody, setEditBody] = useState(body);

  useEffect(() => {
    const selectedClassification = classifications.find(
      (classification) => classification.id === initialClassificationId
    );
    if (selectedClassification) {
      setInitialClassificationAccountId(selectedClassification.account_id);
      setInitialClassificationAccountName(selectedClassification.account_name);
      setInitialClassificationAmount(selectedClassification.amount);

      setEditClassificationAccountId(selectedClassification.account_id);
      setEditClassificationAccountName(selectedClassification.account_name);
      setEditClassificationAmount(selectedClassification.amount);
    }
  }, []);

  const editIncome = async (id: string) => {
    try {
      console.log(editRepetitionSettings);
      if (editClassificationName === null) {
        await incomeEdit(
          id,
          editCategoryId,
          editClassificationId,
          editAmount,
          editSchedule,
          editRepetition,
          editRepetitionType,
          editRepetitionSettings,
          editBody
        );

        const editIncome = {
          id: id,
          category_id: editCategoryId,
          category_name: editCategoryName,
          classification_id: editClassificationId,
          classification_name: editClassificationName,
          amount: editAmount,
          schedule: editSchedule,
          repetition: editRepetition,
          repetition_type: editRepetitionType,
          repetition_settings: editRepetitionSettings,
          body: editBody,
        };

        onIncomeUpdate(editIncome);
      } else {
        if (initialClassificationName !== editClassificationName) {
          const oldClassificationAmount = Math.max(
            0,
            parseFloat(String(initialClassificationAmount)) -
              parseFloat(String(initialAmount))
          );
          const newClassificationAmount = Math.max(
            0,
            parseFloat(String(editClassificationAmount)) +
              parseFloat(String(editAmount))
          );

          await incomeEdit(
            id,
            editCategoryId,
            editClassificationId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );
          if (initialClassificationName !== null) {
            await classificationEdit(
              initialClassificationId,
              initialClassificationAccountId,
              initialClassificationName,
              oldClassificationAmount,
              "income"
            );
          }
          await classificationEdit(
            editClassificationId,
            editClassificationAccountId,
            editClassificationName,
            newClassificationAmount,
            "income"
          );

          const editIncome = {
            id: id,
            category_id: editCategoryId,
            category_name: editCategoryName,
            classification_id: editClassificationId,
            classification_name: editClassificationName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const oldClassification = {
            id: initialClassificationId,
            account_id: initialClassificationAccountId,
            account_name: initialClassificationAccountName,
            name: initialClassificationName,
            amount: oldClassificationAmount,
            classification_type: "income",
          };
          const newClassification = {
            id: editClassificationId,
            account_id: editClassificationAccountId,
            account_name: editClassificationAccountName,
            name: editClassificationName,
            amount: newClassificationAmount,
            classification_type: "income",
          };

          onClassificationUpdate(oldClassification);
          onClassificationUpdate(newClassification);
          onIncomeUpdate(editIncome);
        } else if (initialClassificationName === editClassificationName) {
          const newClassificationAmount = Math.max(
            0,
            parseFloat(String(editClassificationAmount)) -
              parseFloat(String(initialAmount)) +
              parseFloat(String(editAmount))
          );

          await incomeEdit(
            id,
            editCategoryId,
            editClassificationId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );

          await classificationEdit(
            editClassificationId,
            editClassificationAccountId,
            editClassificationName,
            newClassificationAmount,
            "income"
          );

          const editIncome = {
            id: id,
            category_id: editCategoryId,
            category_name: editCategoryName,
            classification_id: editClassificationId,
            classification_name: editClassificationName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const newClassification = {
            id: editClassificationId,
            account_id: editClassificationAccountId,
            account_name: editClassificationAccountName,
            name: editClassificationName,
            amount: newClassificationAmount,
            classification_type: "income",
          };

          onClassificationUpdate(newClassification);
          onIncomeUpdate(editIncome);
        }
      }
    } catch (error) {
      console.error("Failed to edit income:", error);
    }
  };

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }
  }, [editAmount]);

  // フォームの変更を処理するハンドラー
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

  const handleClassificationChange = (
    event: ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    setEditClassificationId(value);
    const selectedClassification = classifications.find(
      (classification) => classification.id === value
    );
    if (selectedClassification) {
      setEditClassificationAccountId(selectedClassification.account_id);
      setEditClassificationAccountName(selectedClassification.account_name);
      setEditClassificationName(selectedClassification.name);
      setEditClassificationAmount(selectedClassification.amount);
    } else {
      setEditClassificationAccountId("");
      setEditClassificationAccountName("");
      setEditClassificationName("");
      setEditClassificationAmount(0);
    }
  };

  const handleCategoryChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setEditCategoryId(value);
    const selectedCategory = categories.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setEditCategoryName(selectedCategory.name);
    } else {
      setEditCategoryName("");
    }
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

  // 「繰り返し」を押されたとき
  const handleRepetitionDialogOpen = () => {
    setRepetitionDialogOpen(true);
    setPeriod("daily");
  };

  // 繰り返しダイアログの枠外をクリックされたとき
  const handleRepetitionDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setFrequency(
      editRepetitionSettings && editRepetitionSettings[0]
        ? editRepetitionSettings[0]
        : 1
    );
    setSelectedDays(
      editRepetitionSettings && editRepetitionSettings.length > 1
        ? editRepetitionSettings.slice(1)
        : []
    );
    setPeriod(editRepetitionType ? editRepetitionType : "");
  };

  // 繰り返しダイアログの削除ボタン押されたとき
  const handleRepetitionDialogDelete = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(false);
    setEditRepetitionType("");
    setEditRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("");
  };

  // 繰り返しダイアログの設定ボタン押されたとき
  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(true);
    setEditRepetitionType(period);
    setEditRepetitionSettings([frequency, ...selectedDays]);
  };

  // 日付が変更されたとき
  const handleSchedulChange = (date: Date) => {
    setEditSchedule(date);
  };

  // 保存ボタン押したとき
  const handleSave = () => {
    if (editAmount > 0) {
      editIncome(id);
      onClose();
    } else {
      setEditAmountError(true);
    }
  };

  const handleFrequencyChange = (delta) => {
    setFrequency((prev) => Math.max(1, prev + delta));
  };

  const handlePeriodChange = (event, newPeriod: string | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      if (newPeriod !== "weekly") {
        setSelectedDays([]);
      }
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev.filter((d) => d !== day), day].sort((a, b) => {
            const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];
            return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
          })
    );
  };

  const calculateNextSchedule = () => {
    if (!editRepetition) return ""; // 繰り返し設定がオフの場合は空文字を返す

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

    const date = new Date(editSchedule);
    const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
    const currentMonth = date.getMonth(); // 予定の日付の月を取得
    const currentYear = date.getFullYear(); // 予定の日付の年を取得
    let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

    switch (editRepetitionType) {
      case "daily":
        nextSchedule += editRepetitionSettings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
        break;

      case "weekly":
        if (editRepetitionSettings.length > 1) {
          const targetDaysOfWeek = editRepetitionSettings
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
            (daysUntilNextSchedule + (editRepetitionSettings[0] - 1) * 7) *
            24 *
            60 *
            60 *
            1000;
        }
        break;

      case "monthly":
        // 次の予定日の年と月を計算
        let nextYear = currentYear;
        let nextMonth = currentMonth + editRepetitionSettings[0];
        if (nextMonth === 12) {
          nextYear++;
          nextMonth = 0; // 0 は 1 月を表す
        }

        // 次の予定日を計算
        const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const nextDayOfMonth = Math.min(date.getDate(), daysInNextMonth);
        const nextDate = new Date(nextYear, nextMonth, nextDayOfMonth);
        nextSchedule = nextDate.getTime();
        break;

      default:
        break;
    }

    // 次の予定日を Date オブジェクトに変換して返す
    return new Date(nextSchedule);
  };

  const nextSchedule = calculateNextSchedule();

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""; // 日付が未定義の場合は空文字を返す

    return moment(date).format("MM/DD/YY");
  };

  return (
    <Box width={560} height={770}>
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
                  classification.classification_type === "income"
              )
              .map((classification) => (
                <MenuItem key={classification.id} value={classification.id}>
                  {classification.name}
                </MenuItem>
              ))}
          </Select>
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
              .filter((category) => category.category_type === "income")
              .map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
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
          <Typography variant="subtitle1">予定</Typography>
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
        <li
          className="pt-5"
          onClick={handleRepetitionDialogOpen} // Open the repetition dialog when clicked
          style={{ cursor: "pointer" }}
        >
          <Typography variant="subtitle1">繰り返し</Typography>
          <Typography>
            {editRepetitionSettings && (
              <>
                {editRepetitionType === "daily" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎日`}
                {editRepetitionType === "weekly" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎週 ${editRepetitionSettings.slice(1).join(" ")}`}
                {editRepetitionType === "monthly" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎月`}
                {editRepetitionSettings[0] > 1 &&
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
          <Typography>
            {editRepetition === true && (
              <>次回の予定：{formatDate(nextSchedule)}</>
            )}
          </Typography>
        </li>
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
            <Button variant="contained" onClick={handleSave} color="primary">
              保存
            </Button>
          </Stack>
          <IconButton
            onClick={() => onDelete(id)}
            className="absolute right-0 bottom-0 m-8"
          >
            <DeleteIcon />
          </IconButton>
        </li>
      </ul>
    </Box>
  );
};
