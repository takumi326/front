"use client";
import React, { useState, ChangeEvent } from "react";
// import NumberFormat from "react-number-format";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { accountEdit as Edit } from "@/lib/api/account-api";
import { accountShowProps } from "@/interface/account-interface";

export const AccountShow: React.FC<accountShowProps> = (props) => {
  const { id, name, amount, body, onUpdate, onClose, onDelete } = props;
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount);
  const [editBody, setEditBody] = useState(body);

  const editAccount = async (id: string) => {
    try {
      await Edit(id, editName, editAmount, editBody);
      const editedData = {
        id: id,
        name: editName,
        amount: editAmount,
        body: editBody,
      };
      onUpdate(editedData);
    } catch (error) {
      console.error("Failed to edit account:", error);
    }
  };

  // フォームの変更を処理するハンドラー
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // name属性に基づいて対応する状態を更新
    switch (name) {
      case "title":
        setEditName(value);
        break;
      case "amount":
        setEditAmount(value === "" ? 0 : parseInt(value, 100));
        break;
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // const handleCheckboxChange = () => {
  //   setEditCompleted(!editCompleted); // 現在の値を反転させて更新
  // };

  // // 日付が変更されたときのハンドラ
  // const handleDateChange = (date: Date) => {
  //   setEditDeadline(date);
  // };

  const handleSave = () => {
    editAccount(id);
    onClose();
  };

  return (
    <Box width={560} height={550}>
      <ul className="w-full">
        {/* <li className="flex items-center">
          <Typography>{editCompleted ? "完了" : "未完了"}</Typography>
          <Checkbox
            checked={editCompleted}
            onChange={handleCheckboxChange}
            color="primary"
          />
        </li> */}
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
              type="number"
              name="amount"
              value={editAmount}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              required
            />
            {/* <NumberFormat value={123456789} thousandSeparator={true} /> */}
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
