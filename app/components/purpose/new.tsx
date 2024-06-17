"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { purposeContext } from "@/context/purpose-context";

import { purposeNew } from "@/lib/api/purpose-api";

import { purposeNewProps } from "@/interface/purpose-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const PurposeNew: React.FC<purposeNewProps> = (props) => {
  const { onClose } = props;
  const { purposes, setIsEditing } = useContext(purposeContext);

  const initialDateObject = new Date().toLocaleDateString().split("T")[0];

  const [newTitle, setNewTitle] = useState("");
  const [newTitleError, setNewTitleError] = useState<boolean>(false);
  const [newResult, setNewResult] = useState("");
  const [newDeadline, setNewDeadline] = useState(initialDateObject);
  const [newBody, setNewBody] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const purpose = purposes.filter((purpose) => purpose.title === newTitle)[0];
    if (purpose != undefined) {
      setNewTitleError(true);
    } else {
      setNewTitleError(false);
    }
  }, [newTitle]);

  const newPurpose = async () => {
    try {
      await purposeNew(newTitle, newResult, newDeadline, newBody);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create purpose:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setNewTitle(value);
        setIsFormValid(value.trim().length > 0);
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

  const handleDateChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setNewDeadline(stringDate);
  };

  const handleSave = () => {
    newPurpose();
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
        <li>
          {newTitleError && (
            <Typography align="left" variant="subtitle1">
              同じ名称は作成できません
            </Typography>
          )}
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
