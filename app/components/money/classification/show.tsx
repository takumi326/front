"use client";
import React, { useState, ChangeEvent, useContext } from "react";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { moneyContext } from "@/context/money-context";

import { classificationEdit as Edit } from "@/lib/api/classification-api";
import { classificationShowProps } from "@/interface/classification-interface";

export const ClassificationShow: React.FC<classificationShowProps> = (
  props
) => {
  const {
    id,
    account_id,
    account_name,
    name,
    amount,
    classification_type,
    onUpdate,
    onClose,
    onDelete,
  } = props;
  const { accounts } = useContext(moneyContext);

  const [editAccountId, setEditAccountId] = useState(account_id);
  const [editAccountName, setEditAccountName] = useState(account_name);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const editClassification = async (id: string) => {
    try {
      await Edit(id, editAccountId, editName, editAmount, classification_type);
      const editedData = {
        id: id,
        account_id: editAccountId,
        account_name: editAccountName,
        name: editName,
        amount: editAmount,
        classification_type: classification_type,
      };
      onUpdate(editedData);
    } catch (error) {
      console.error("Failed to edit classification:", error);
    }
  };

  const handleAccountChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setEditAccountId(value);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setEditAccountName(selectedAccount.name);
    } else {
      setEditAccountName("");
    }
  };

  // フォームの変更を処理するハンドラー
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // name属性に基づいて対応する状態を更新
    switch (name) {
      case "name":
        setEditName(value);
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
      default:
        break;
    }
  };

  const handleSave = () => {
    editClassification(id);
    onClose();
  };

  return (
    <Box width={560} height={450}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">分類名</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            value={editName}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">支払い口座</Typography>
          <Select
            fullWidth
            value={editAccountId}
            onChange={handleAccountChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
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
