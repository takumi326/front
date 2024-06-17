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
import CloseIcon from "@mui/icons-material/Add";

import { taskContext } from "@/context/task-context";

import { taskEdit, taskDelete } from "@/lib/api/task-api";
import {
  completedRepetitionTaskNew,
  completedRepetitionTaskEdit,
  completedRepetitionTaskDelete,
} from "@/lib/api/completedRepetitionTask-api";
import { taskShowProps } from "@/interface/task-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";
import { RepetitionTaskRow } from "@/components/repetitionTask/row";

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
  const {
    purposes,
    completedRepetitionTasks,
    currentMonth,
    setIsEditing,
    loading,
    setLoading,
  } = useContext(taskContext);
  const initialDateObject = new Date().toLocaleDateString().split("T")[0];
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();
  const start = new Date(
    Number(currentMonth.slice(0, 4)),
    Number(currentMonth.slice(4)) - 1,
    1
  );
  const end = new Date(
    Number(currentMonth.slice(0, 4)),
    Number(currentMonth.slice(4)),
    0,
    23,
    59
  );

  const [repetitionNewDialogOpen, setRepetitionNewDialogOpen] =
    useState<boolean>(false);
  const [editRepetitionSchedule, setEditRepetitionSchedule] =
    useState(initialDateObject);

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
  const [changeRepetitionTaskData, setChangeRepetitionTaskData] = useState<
    string[]
  >([]);

  const initialSchedule = schedule;
  const initialEndDate = end_date;
  const initialRepetition = repetition;
  const intialRepetitionType = repetition_type;
  const intialRepetitionSettings = repetition_settings;

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
  const [sortRepetitionTask, setSortRepetitionTask] = useState<boolean>(false);

  const editTask = async (id: string) => {
    setLoading(true);
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
      if (
        editRepetition === true &&
        initialRepetition === editRepetition &&
        intialRepetitionType === editRepetitionType &&
        JSON.stringify(intialRepetitionSettings) ===
          JSON.stringify(editRepetitionSettings) &&
        initialSchedule === editSchedule &&
        initialEndDate === editEndDate
      ) {
        for (let i = 0; i < changeRepetitionTaskData.length; i += 2) {
          const selectedRepetitionTask = completedRepetitionTasks.filter(
            (completedRepetitionTask) =>
              completedRepetitionTask.id === changeRepetitionTaskData[i]
          )[0];
          await completedRepetitionTaskEdit(
            changeRepetitionTaskData[i],
            selectedRepetitionTask.task_id,
            changeRepetitionTaskData[i + 1],
            selectedRepetitionTask.completed
          );
        }
      } else {
        if (editRepetition === true) {
          if (initialRepetition === true) {
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
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await taskDelete(taskId);
      setIsEditing(true);
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRepetition = async (id: string) => {
    setLoading(true);
    try {
      await completedRepetitionTaskDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRepetitionTaskDialogOpen = () => {
    setRepetitionNewDialogOpen(true);
    setEditRepetitionSchedule(initialDateObject);
  };

  const handleNewRepetitionTaskDialogCancel = () => {
    setRepetitionNewDialogOpen(false);
  };

  const handleNewRepetitionTaskSave = async () => {
    setLoading(true);
    setRepetitionNewDialogOpen(false);
    try {
      await completedRepetitionTaskNew(id, editRepetitionSchedule, false);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionPayment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepetitionTaskChange = async (id: string, date: string) => {
    setChangeRepetitionTaskData((prevData) => {
      const newData = [...prevData];
      newData.push(id, date);
      return newData;
    });
  };

  const handleRepetitionSchedulChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditRepetitionSchedule(stringDate);
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
    setPeriod("daily");
    setEditSchedule(initialDateObject);
    setEditEndDate(endDateObject);
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

  const handleSortRepetitionTask = () => {
    setSortRepetitionTask(!sortRepetitionTask);
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

  const sortedRows = completedRepetitionTasks
    .filter((completedRepetitionTask) => completedRepetitionTask.task_id === id)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.completed_date).getTime();
      const dateB = new Date(b.completed_date).getTime();
      return dateA - dateB;
    });

  const sortedCurrentMonthRows = completedRepetitionTasks
    .filter(
      (completedRepetitionTask) =>
        completedRepetitionTask.task_id === id &&
        new Date(completedRepetitionTask.completed_date).getTime() >=
          start.getTime() &&
        new Date(completedRepetitionTask.completed_date).getTime() <=
          end.getTime()
    )
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.completed_date).getTime();
      const dateB = new Date(b.completed_date).getTime();
      return dateA - dateB;
    });

  return (
    <Box
      sx={{
        width:
          editRepetition === true &&
          intialRepetitionType === editRepetitionType &&
          JSON.stringify(intialRepetitionSettings) ===
            JSON.stringify(editRepetitionSettings) &&
          initialSchedule === editSchedule &&
          initialEndDate === editEndDate &&
          completedRepetitionTasks.filter(
            (completedRepetitionTask) => completedRepetitionTask.task_id === id
          ).length > 0
            ? 1000
            : 560,
        height: 815,
      }}
    >
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

      <Dialog
        open={repetitionNewDialogOpen}
        onClose={handleNewRepetitionTaskDialogCancel}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "400px",
            height: "410px",
          },
        }}
      >
        <button
          onClick={handleNewRepetitionTaskDialogCancel}
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </button>
        <DialogTitle sx={{ textAlign: "center" }}>新規作成</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <Typography variant="subtitle1">日付</Typography>
            <Box
              sx={{
                width: 105,
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "20px",
              }}
            >
              <InputDateTime
                selectedDate={editRepetitionSchedule}
                onChange={handleRepetitionSchedulChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }} className="mb-32">
          <Button
            onClick={handleNewRepetitionTaskSave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={5}>
        <ul className="w-full">
          {editRepetition === false && (
            <li className="flex items-center pt-10">
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
          <li className="pt-10">
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
              {loading === true ? (
                <Typography variant="subtitle1">Loading...</Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className="ml-60"
                  >
                    保存
                  </Button>
                  <IconButton
                    onClick={() => deleteTask(id)}
                    className="ml-auto"
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Stack>
          </li>
        </ul>
        {editRepetition === true &&
          intialRepetitionType === editRepetitionType &&
          JSON.stringify(intialRepetitionSettings) ===
            JSON.stringify(editRepetitionSettings) &&
          initialSchedule === editSchedule &&
          initialEndDate === editEndDate &&
          completedRepetitionTasks.filter(
            (completedRepetitionTask) => completedRepetitionTask.task_id === id
          ).length > 0 && (
            <div className="w-full pt-10">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" mr={2}>
                    繰り返し一覧
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={sortRepetitionTask}
                      onChange={handleSortRepetitionTask}
                    />
                    <Typography>カレンダーの表示月のみ</Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleNewRepetitionTaskDialogOpen}>
                  <AddIcon />
                </IconButton>
              </Box>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 635, border: "0.5px solid black" }}
              >
                <Table stickyHeader size="small" aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortRepetitionTask === true
                      ? sortedCurrentMonthRows.map(
                          (completedRepetitionTask) => (
                            <RepetitionTaskRow
                              key={completedRepetitionTask.id}
                              id={completedRepetitionTask.id}
                              task_id={completedRepetitionTask.task_id}
                              completed_date={
                                completedRepetitionTask.completed_date
                              }
                              completed={completedRepetitionTask.completed}
                              onChange={handleRepetitionTaskChange}
                              onDelete={deleteRepetition}
                            />
                          )
                        )
                      : sortedRows.map((completedRepetitionTask) => (
                          <RepetitionTaskRow
                            key={completedRepetitionTask.id}
                            id={completedRepetitionTask.id}
                            task_id={completedRepetitionTask.task_id}
                            completed_date={
                              completedRepetitionTask.completed_date
                            }
                            completed={completedRepetitionTask.completed}
                            onChange={handleRepetitionTaskChange}
                            onDelete={deleteRepetition}
                          />
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}{" "}
      </Stack>
    </Box>
  );
};
