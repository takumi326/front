"use client";
import React, { useState, ChangeEvent, useContext } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { taskContext } from "@/context/task-context";

import { taskNew } from "@/lib/api/task-api";
import { taskNewProps } from "@/interface/task-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const TaskNew: React.FC<taskNewProps> = (props) => {
  const { onAdd, onClose } = props;
  const initialDateObject = new Date().toLocaleDateString().split("T")[0];
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();
  const { purposes } = useContext(taskContext);

  const [repetitionDialogOpen, setRepetitionDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [period, setPeriod] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newPurposeId, setNewPurposeId] = useState("");
  const [newSchedule, setNewSchedule] = useState(initialDateObject);
  const [newEndDate, setNewEndDate] = useState(endDateObject);
  const [newRepetition, setNewRepetition] = useState<boolean>(false);
  const [newRepetitionType, setNewRepetitionType] = useState("");
  const [newRepetitionSettings, setNewRepetitionSettings] = useState<string[]>(
    []
  );
  // const [newTime, setNewTime] = useState("");
  const [newBody, setNewBody] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const newTask = async () => {
    try {
      await taskNew(
        newTitle,
        newPurposeId,
        newSchedule,
        newEndDate,
        newRepetition,
        newRepetitionType,
        newRepetitionSettings,
        newBody
      );
      onAdd();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setNewTitle(value);
        setIsFormValid(value.trim().length > 0);
        break;
      case "body":
        setNewBody(value);
        break;
      default:
        break;
    }
  };

  const handlePurposeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setNewPurposeId(value);
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
    setNewSchedule(stringDate);
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
    newTask();
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

  const calculateNextSchedule = () => {
    if (!newRepetition) return ""; // 繰り返し設定がオフの場合は空文字を返す

    // 曜日名を整数にマッピングする関数
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
          return NaN; // 不正な曜日名の場合はNaNを返す
      }
    };

    const date = new Date(newSchedule);
    const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
    const currentMonth = date.getMonth(); // 予定の日付の月を取得
    const currentYear = date.getFullYear(); // 予定の日付の年を取得
    let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

    switch (newRepetitionType) {
      case "daily":
        nextSchedule += Number(newRepetitionSettings[0]) * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
        break;

      case "weekly":
        if (newRepetitionSettings.length > 1) {
          const targetDaysOfWeek = newRepetitionSettings
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
              (Number(newRepetitionSettings[0]) - 1) * 7) *
            24 *
            60 *
            60 *
            1000;
        }
        break;

      case "monthly":
        // 次の予定日の年と月を計算
        let nextYear = currentYear;
        let nextMonth = currentMonth + Number(newRepetitionSettings[0]);
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
    if (new Date(newEndDate).getTime() >= new Date(nextSchedule).getTime()) {
      return new Date(nextSchedule);
    }
  };

  const nextSchedule = calculateNextSchedule();

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";

    return moment(date).format("MM/DD/YY");
  };

  const isDialogFormValid =
    period === "daily" ||
    period === "monthly" ||
    (period === "weekly" && selectedDays.length > 0);

  return (
    <Box width={560} height={650}>
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
                {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                  <ToggleButton
                    key={day}
                    value={day}
                    selected={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  >
                    {day}
                  </ToggleButton>
                ))}
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
          <Typography variant="subtitle1">タイトル</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            value={newTitle}
            onChange={handleChange}
          />
        </li>
        <li className="pt-5">
          <Typography variant="subtitle1">関連する目標</Typography>
          <Select
            fullWidth
            value={newPurposeId}
            onChange={handlePurposeChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {purposes.map((purpose) => (
              <MenuItem key={purpose.id} value={purpose.id}>
                {purpose.title}
              </MenuItem>
            ))}
          </Select>
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
            <Typography>※設定しない場合は今日から5年後が設定されます</Typography>
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
        <li className="pt-5">
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid}
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
