"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import moment from "moment";

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
} from "@mui/material";

import { taskEdit as Edit } from "@/lib/api/task-api";
import { taskNewProps } from "@/interface/task-interface";

import { purposeGetData } from "@/lib/api/purpose-api";
import { purposeData } from "@/interface/purpose-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export const TaskNew: React.FC<taskNewProps> = (props) => {
  const { onAdd, onClose } = props;
  const undifindDateObject = new Date();

  const [purposes, setPurposes] = useState<purposeData[]>([]);
  const [repetitionDialogOpen, setRepetitionDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [period, setPeriod] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newPurposeId, setNewPurposeId] = useState("");
  const [newSchedule, setNewSchedule] = useState<Date>(undifindDateObject);
  const [newRepetition, setNewRepetition] = useState<boolean>(false);
  const [newRepetitionType, setNewRepetitionType] = useState("");
  const [newRepetitionSettings, setNewRepetitionSettings] = useState("");
  // const [newTime, setNewTime] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    purposeGetData().then((data) => {
      setPurposes(data);
    });
  }, []);

  const newTask = async () => {
    try {
      const newData = await New(
        newTitle,
        newPurposeId,
        newSchedule,
        newRepetition,
        newRepetitionType,
        newRepetitionSettings,
        newBody
      );
      onAdd(newData);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // フォームの変更を処理するハンドラー
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // name属性に基づいて対応する状態を更新
    switch (name) {
      case "title":
        setNewTitle(value);
        break;
      case "body":
        setNewBody(value);
        break;
      default:
        break;
    }
  };

  const handlePurposeChange = (event: ChangeEvent<{ value: unknown }>) => {
    setNewPurposeId(event.target.value as string);
  };

  const handleSchedulChange = (date: Date) => {
    setNewSchedule(date);
  };

  const handleRepetitionChange = () => {};

  const handleSave = () => {
    newTask();
    onClose();
  };

  return (
    <Box width={560} height={600}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">タイトル</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            value={newTitle}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
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
        <li className="pt-10">
          <Typography variant="subtitle1">予定</Typography>
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
        <li className="pt-10">
          <Typography variant="subtitle1">繰り返し</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              borderWidth: "px",
            }}
          ></Box>
        </li>
        <li className="pt-10">
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
            <Button variant="contained" onClick={handleSave} color="primary">
              作成
            </Button>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
