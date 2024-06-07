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

import { accountEdit } from "@/lib/api/account-api";
import { accountShowProps } from "@/interface/account-interface";

export const AccountShow: React.FC<accountShowProps> = (props) => {
  const { id, name, amount, body, onClose, onDelete } = props;
  const { setIsEditing } = useContext(moneyContext);

  const [editName, setEditName] = useState<string>(name);
  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editBody, setEditBody] = useState<string>(body);
  const [isFormValid, setIsFormValid] = useState(true);

  const editAccount = async (id: string) => {
    try {
      await accountEdit(id, editName, editAmount, editBody);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit account:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setEditName(value);
        setIsFormValid(value.trim().length > 0);
        break;
      case "amount":
        setEditAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setEditAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    editAccount(id);
    onClose();
  };

  return (
    <Box width={560} height={450}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">口座名</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            value={editName}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">金額</Typography>
          <div className="flex items-center">
            <TextField
              variant="outlined"
              name="amount"
              value={editAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <span>円</span>
          </div>
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
              color="primary"
            >
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
