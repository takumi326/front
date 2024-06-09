"use client";
import React, { useState, useContext, ChangeEvent } from "react";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { moneyContext } from "@/context/money-context";

import { categoryEdit } from "@/lib/api/category-api";
import { categoryShowProps } from "@/interface/category-interface";

export const CategoryShow: React.FC<categoryShowProps> = (props) => {
  const { id, name, category_type, onClose, onDelete } = props;
  const { setIsEditing } = useContext(moneyContext);

  const [editName, setEditName] = useState<string>(name);
  const [isFormValid, setIsFormValid] = useState(true);

  const editCategory = async (id: string) => {
    try {
      await categoryEdit(id, editName, category_type);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit category:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setEditName(value);
        setIsFormValid(value.trim().length > 0);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    editCategory(id);
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
            value={editName}
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
              保存
            </Button>

            <IconButton
              onClick={() => onDelete(id)}
              className="absolute right-0 bottom-0 m-8"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
