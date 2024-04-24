"use client";
import React, { useState, useEffect } from "react";
import { PurposeEdit as Edit } from "@/lib/api/PurposeDate";
import moment from "moment";
import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

// Purposeの型定義
type Purpose = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};

export const PurposeShow: React.FC<Purpose> = (props) => {
  const { id, title, result, deadline, body, completed, onEdit, onClose } =
    props;
  const undifindDateObject = new Date();

  const [editTitle, setEditTitle] = useState(title);
  const [editResult, setEditResult] = useState(result);
  const [editDeadline, setEditDeadline] = useState<Date>(deadline);
  const [editBody, setEditBody] = useState(body);
  const [editCompleted, setEditCompleted] = useState<boolean>(completed);

  const editPurpose = async (id: string) => {
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
      onEdit(editedData);
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  // フォームの変更を処理するハンドラー
  const handleChange = (e) => {
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

  const dateObject = new Date(editDeadline);

  // 日付が変更されたときのハンドラ
  const handleDateChange = (date) => {
    setEditDeadline(date);
  };

  const formattedDeadline = moment(deadline).format("MM/DD/YY");

  // 選択された時刻をフォーマットする関数
  const formatSelectedTime = (date) => {
    return date.toLocaleTimeString();
  };

  const handleClearDate = () => {
    setEditDeadline(undefined);
  };

  const handleSave = () => {
    editPurpose(id);
    onClose();
  };

  // console.log(editTitle);
  // console.log(editResult);
  // console.log(editDeadline);
  // console.log(editBody);
  // console.log(editCompleted);

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
          <Box sx={{ border: "1px solid #ccc", borderRadius: "4px",borderWidth: "px" }}>
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
        </li>
      </ul>
    </Box>
  );
};
