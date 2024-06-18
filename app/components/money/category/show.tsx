"use client";
import React, { useState, useEffect, useContext, ChangeEvent } from "react";

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
  const { categories, setIsEditing, setLoading } = useContext(moneyContext);

  const [editName, setEditName] = useState<string>(name);
  const [editNameError, setEditNameError] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const category = categories.filter(
      (category) => category.name === editName
    )[0];
    if (category != undefined) {
      if (category.id != id) {
        setEditNameError(true);
      }
    } else {
      setEditNameError(false);
    }
  }, [editName]);

  const editCategory = async (id: string) => {
    setLoading(true);
    try {
      await categoryEdit(id, editName, category_type);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit category:", error);
    } finally {
      setLoading(false);
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
    <Box width={560} height={230}>
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
        <li>
          {editNameError && (
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
              disabled={!isFormValid}
              color="primary"className="ml-60"
            >
              保存
            </Button>

            <IconButton
              onClick={() => onDelete(id)}
              className="ml-auto"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
