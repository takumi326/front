"use client";
import React, { useState, ChangeEvent, useContext } from "react";

import {
  Box,
  Checkbox,
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

import { taskContext } from "@/context/task-context";

import { taskEdit, taskDelete } from "@/lib/api/task-api";
import {
  completedRepetitionTaskNew,
  completedRepetitionTaskDelete,
} from "@/lib/api/completedRepetitionTask-api";
import { taskShowProps } from "@/interface/task-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const TaskShow: React.FC<taskShowProps> = (props) => {
  const {
    id,
    title,
    purpose_id,
    schedule,
    end_date,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    completed,
    onClose,
  } = props;
  const { purposes, completedRepetitionTasks, setIsEditing } =
    useContext(taskContext);

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

  const initialRepetiion = repetition;

  const [editTitle, setEditTitle] = useState(title);
  const [editPurposeId, setEditPurposeId] = useState(purpose_id);
  const [editSchedule, setEditSchedule] = useState(schedule);
  const [editEndDate, setEditEndDate] = useState(end_date);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState<string[]>(repetition_settings);
  // const [editTime, setEditTime] = useState(time);
  const [editBody, setEditBody] = useState(body);
  const [editCompleted, setEditCompleted] = useState<boolean>(completed);
  const [isFormValid, setIsFormValid] = useState(true);

  const editTask = async (id: string) => {
    try {
      await taskEdit(
        id,
        editTitle,
        editPurposeId,
        editSchedule,
        editEndDate,
        editRepetition,
        editRepetitionType,
        editRepetitionSettings,
        editBody,
        editCompleted
      );
      if (editRepetition === true) {
        if (initialRepetiion === true) {
          await Promise.all(
            completedRepetitionTasks
              .filter(
                (completedRepetitionTask) =>
                  completedRepetitionTask.task_id === id
              )
              .map((completedRepetitionTask) =>
                completedRepetitionTaskDelete(completedRepetitionTask.id)
              )
          );
        }
        const schedules = calculateNextSchedules();
        await Promise.all(
          schedules.map(async (schedule) => {
            const stringDate = new Date(schedule)
              .toLocaleDateString()
              .split("T")[0];
            await completedRepetitionTaskNew(id, stringDate, false);
          })
        );
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskDelete(taskId);
      setIsEditing(true);
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setEditTitle(value);
        setIsFormValid(value.trim().length > 0);
        break;
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const handlePurposeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditPurposeId(value);
  };

  const handleCheckboxChange = () => {
    setEditCompleted(!editCompleted);
  };

  const handleRepetitionDialogOpen = () => {
    setRepetitionDialogOpen(true);
    setPeriod("daily");
  };

  const handleRepetitionDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setFrequency(
      editRepetitionSettings && editRepetitionSettings[0]
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
        completedRepetitionTasks
          .filter(
            (completedRepetitionTask) => completedRepetitionTask.task_id === id
          )
          .map((completedRepetitionTask) =>
            completedRepetitionTaskDelete(completedRepetitionTask.id)
          )
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
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
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 5);
    const endDateObject = currentDate.toLocaleDateString();
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      stringDate = endDateObject;
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }
    setEditEndDate(stringDate);
  };

  const handleSave = () => {
    editTask(id);
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

    const startDate = new Date(editSchedule);
    const endDate = new Date(editEndDate);
    endDate.setHours(23, 59, 59, 999);
    let schedules = [];
    let currentDate = startDate;
    const repetitionWeek = editRepetitionSettings.slice(1).length;
    let times = 1;

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

          const repetitionTimes = 7 * (Number(editRepetitionSettings[0]) - 1);
          if (repetitionWeek === 1 || times === 1) {
            for (let i = 1; i <= 7; i++) {
              nextDayOfWeek = (currentDayOfWeek + i) % 7;
              if (targetDaysOfWeek.includes(nextDayOfWeek)) {
                currentDate.setDate(
                  currentDate.getDate() + i + repetitionTimes
                );
                times += 1;
                break;
              }
            }
          } else {
            for (let i = 1; i <= 7; i++) {
              nextDayOfWeek = (currentDayOfWeek + i) % 7;
              if (targetDaysOfWeek.includes(nextDayOfWeek)) {
                currentDate.setDate(currentDate.getDate() + i);
                if (times === repetitionWeek) {
                  times = 1;
                } else if (times < repetitionWeek) {
                  times += 1;
                }
                break;
              }
            }
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

  const sortedPurposes = purposes.slice().sort((a, b) => {
    if (a.id === editPurposeId) {
      return -1;
    } else if (b.id === editPurposeId) {
      return 1;
    }
    return a.id > b.id ? 1 : -1;
  });

  return (
    <Box width={560} height={680}>
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
        {editRepetition === false && (
          <li className="flex items-center">
            <Stack direction="row" alignItems="center">
              <Checkbox
                checked={editCompleted}
                onChange={handleCheckboxChange}
                color="primary"
              />
              <Typography>{editCompleted ? "完了" : "未完了"}</Typography>
            </Stack>
          </li>
        )}
        <li className="pt-5">
          <Typography variant="subtitle1">タイトル</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            value={editTitle}
            onChange={handleChange}
          />
        </li>
        <li className="pt-5">
          <Typography variant="subtitle1">関連する目標</Typography>
          <Select
            fullWidth
            value={editPurposeId}
            onChange={handlePurposeChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sortedPurposes.map((purpose) => (
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
        <li className="pt-5">
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid}
              className="ml-60"
            >
              保存
            </Button>
            <IconButton onClick={() => deleteTask(id)} className="ml-auto">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
