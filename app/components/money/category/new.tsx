"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { moneyContext } from "@/context/money-context";

import { categoryNew } from "@/lib/api/category-api";
import { categoryNewProps } from "@/interface/category-interface";

export const CategoryNew: React.FC<categoryNewProps> = (props) => {
  const { category_type, onClose } = props;
  const { categories, setIsEditing, setLoading } = useContext(moneyContext);

  const [newName, setNewName] = useState("");
  const [newNameError, setNewNameError] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const category = categories.filter(
      (category) => category.name === newName
    )[0];
    if (category != undefined) {
      setNewNameError(true);
    } else {
      setNewNameError(false);
    }
  }, [newName]);

  const newCategory = async () => {
    setLoading(true);
    try {
      await categoryNew(newName, category_type);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setLoading(false);
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
    <Box width={560} height={230}>
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
        <li>
          {newNameError && (
            <Typography align="left" variant="subtitle1">
              同じ名称は作成できません
            </Typography>
          )}
        </li>
        <li className="pt-10">
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid || newNameError}
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
