"use client";
import React, { useState, ChangeEvent, useContext } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { moneyContext } from "@/context/money-context";

import { categoryNew } from "@/lib/api/category-api";
import { categoryNewProps } from "@/interface/category-interface";

export const CategoryNew: React.FC<categoryNewProps> = (props) => {
  const { category_type, onClose } = props;
  const { setIsEditing } = useContext(moneyContext);

  const [newName, setNewName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const newCategory = async () => {
    try {
      await categoryNew(newName, category_type);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setNewName(value);
        setIsFormValid(value.trim().length > 0);
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
