"use client";
import React, { useState, ChangeEvent } from "react";

import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

import { taskEdit as Edit } from "@/lib/api/task-api";
import { taskShowProps } from "@/interface/task-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const TaskShow: React.FC<taskShowProps> = (props) => {
  const {
    id,
    title,
    purpose_id,
    purpose_title,
    schedule,
    time,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    completed,
    onUpdate,
    onClose,
  } = props;
  const [editTitle, setEditTitle] = useState(title);
  const [editPurposeId, setEditPurposeId] = useState(purpose_id);
  const [editPurposeTitle, setEditPurposeTitle] = useState(purpose_title);
  const [editSchedule, setEditSchedule] = useState<Date>(schedule);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState(repetition_settings);
  const [editTime, setEditTime] = useState(time);
  const [editBody, setEditBody] = useState(body);
  const [editCompleted, setEditCompleted] = useState<boolean>(completed);

  const editTask = async (id: string) => {
    try {
      await Edit(
        id,
        editTitle,
        editPurposeId,
        editPurposeTitle,
        editSchedule,
        editRepetition,
        editRepetitionType,
        editRepetitionSettings,
        editTime,
        editBody,
        editCompleted
      );
      const editedData = {
        id: id,
        title: editTitle,
        purpose_id: editPurposeId,
        purpose_title: editPurposeTitle,
        schedule: editSchedule,
        repetition: editRepetition,
        repetition_type: editRepetitionType,
        repetition_settings: editRepetitionSettings,
        time: editTime,
        body: editBody,
        completed: editCompleted,
      };
      onUpdate(editedData);
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  // フォームの変更を処理するハンドラー
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // name属性に基づいて対応する状態を更新
    switch (name) {
      case "title":
        setEditTitle(value);
        break;
      case "time":
        setEditTime(value);
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = () => {
    setEditCompleted(!editCompleted); // 現在の値を反転させて更新
  };

  const handleRepetitonChange = () => {
    setEditRepetition(!editRepetition); 
  };

  // 日付が変更されたときのハンドラ
  const handleSchedulChange = (date: Date) => {
    setEditSchedule(date);
  };

  const handleSave = () => {
    editTask(id);
    onClose();
  };

  return (
    <Box width={560} height={600}>
      <ul className="w-full">
        <li className="flex items-center">
          <Typography>{editCompleted ? "完了" : "未完了"}</Typography>
          <Checkbox
            checked={editCompleted}
            onChange={handleCheckboxChange}
            color="primary"
          />
        </li>
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
        <li className="pt-10">
          <Typography variant="subtitle1">関連する目標</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="purpose_title"
            value={editPurposeTitle}
            onChange={handleChange}
          />
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
              selectedDate={editSchedule}
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
          >
            <InputDateTime
              selectedDate={editSchedule}
              onChange={handleSchedulChange}
            />
          </Box>
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">どのくらいやったか</Typography>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            name="time"
            value={editTime}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
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
        </li>
      </ul>
    </Box>
  );
};
