"use client";
import React, { useState, ChangeEvent } from "react";

import {
  Box,
  Checkbox,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { accountEdit as Edit } from "@/lib/api/account-api";
import { accountShowProps } from "@/interface/account-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const AccountShow: React.FC<accountShowProps> = (props) => {
  const {
    id,
    title,
    result,
    deadline,
    body,
    completed,
    onUpdate,
    onClose,
    onDelete,
  } = props;
  const [editTitle, setEditTitle] = useState(title);
  const [editResult, setEditResult] = useState(result);
  const [editDeadline, setEditDeadline] = useState<Date>(deadline);
  const [editBody, setEditBody] = useState(body);
  const [editCompleted, setEditCompleted] = useState<boolean>(completed);

  const editAccount = async (id: string) => {
    try {
      await Edit(
        id,
        editTitle,
        editResult,
        editDeadline,
        editBody,
        editCompleted
      );
      const editedData = {
        id: id,
        title: editTitle,
        result: editResult,
        deadline: editDeadline,
        body: editBody,
        completed: editCompleted,
      };
      onUpdate(editedData);
    } catch (error) {
      console.error("Failed to edit todo:", error);
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
      case "result":
        setEditResult(value);
        break;
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

  // 日付が変更されたときのハンドラ
  const handleDateChange = (date: Date) => {
    setEditDeadline(date);
  };

  const handleSave = () => {
    editAccount(id);
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
          <Typography variant="subtitle1">目標</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="result"
            value={editResult}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">期限</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              borderWidth: "px",
            }}
          >
            <InputDateTime
              selectedDate={editDeadline}
              onChange={handleDateChange}
            />
          </Box>
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
