"use client";
import React, { useState, ChangeEvent } from "react";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { categoryEdit as Edit } from "@/lib/api/category-api";
import { categoryShowProps } from "@/interface/category-interface";

export const CategoryShow: React.FC<categoryShowProps> = (props) => {
  const { id, name, category_type, onUpdate, onClose, onDelete } = props;
  const [editName, setEditName] = useState<string>(name);

  const editCategory = async (id: string) => {
    try {
      await Edit(id, editName, category_type);
      onUpdate();
    } catch (error) {
      console.error("Failed to edit category:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setEditName(value);
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