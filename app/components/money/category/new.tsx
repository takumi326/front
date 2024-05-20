"use client";
import React, { useState, ChangeEvent } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { categoryNew as New } from "@/lib/api/category-api";
import { categoryNewProps } from "@/interface/category-interface";

export const CategoryNew: React.FC<categoryNewProps> = (props) => {
  const { onClassificationAdd, onClose, classification_type } = props;

  const [newName, setNewName] = useState("");

  const newCategory = async () => {
    try {
      const response = await New(newName, classification_type);
      onClassificationAdd(response);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setNewName(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    newCategory();
    onClose();
  };

  return (
    <Box width={560} height={200}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">カテゴリ名</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            value={newName}
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
