"use client";
import React, { useState, ChangeEvent } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { purposeNew as New } from "@/lib/api/purpose-api";
import { purposeNewProps } from "@/interface/purpose-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const PurposeNew: React.FC<purposeNewProps> = (props) => {
  const { onAdd, onClose } = props;
  const undifindDateObject = new Date();

  const [newTitle, setNewTitle] = useState("");
  const [newResult, setNewResult] = useState("");
  const [newDeadline, setNewDeadline] = useState<Date>(undifindDateObject);
  const [newBody, setNewBody] = useState("");

  const newPurpose = async () => {
    try {
      const response = await New(newTitle, newResult, newDeadline, newBody);
      console.log(newTitle);
      onAdd(response);
    } catch (error) {
      console.error("Failed to create todo:", error);
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
      case "result":
        setNewResult(value);
        break;
      case "body":
        setNewBody(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    newPurpose();
    console.log(newTitle);
    onClose();
  };

  const handleDateChange = (date: Date) => {
    setNewDeadline(date);
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
          <Typography variant="subtitle1">目標</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="result"
            value={newResult}
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
              selectedDate={newDeadline}
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
