"use client";
import React, { useState, ChangeEvent, useContext } from "react";

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

import { purposeContext } from "@/context/purpose-context";

import { purposeEdit, purposeDelete } from "@/lib/api/purpose-api";

import { purposeShowProps } from "@/interface/purpose-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const PurposeShow: React.FC<purposeShowProps> = (props) => {
  const { id, title, result, deadline, body, completed, onClose } = props;
  const { setIsEditing } = useContext(purposeContext);

  const [editTitle, setEditTitle] = useState(title);
  const [editResult, setEditResult] = useState(result);
  const [editDeadline, setEditDeadline] = useState(deadline);
  const [editBody, setEditBody] = useState(body);
  const [editCompleted, setEditCompleted] = useState<boolean>(completed);
  const [isFormValid, setIsFormValid] = useState(true);

  const editPurpose = async (id: string) => {
    try {
      await purposeEdit(
        id,
        editTitle,
        editResult,
        editDeadline,
        editBody,
        editCompleted
      );
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit purpose:", error);
    }
  };

  const deletePurpose = async (id: string) => {
    try {
      await purposeDelete(id);
      setIsEditing(true);
      onClose();
    } catch (error) {
      console.error("Failed to delete purpose:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setEditTitle(value);
        setIsFormValid(value.trim().length > 0);
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
    setEditCompleted(!editCompleted);
  };

  const handleDateChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditDeadline(stringDate);
  };

  const handleSave = () => {
    editPurpose(id);
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
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid}
              className="ml-60"
            >
              保存
            </Button>
            <IconButton onClick={() => deletePurpose(id)} className="ml-auto">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
