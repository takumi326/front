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

import { moneyContext } from "@/context/money-context";

import { classificationNew as New } from "@/lib/api/classification-api";
import { classificationNewProps } from "@/interface/classification-interface";

export const ClassificationNew: React.FC<classificationNewProps> = (props) => {
  const { onClassificationAdd, onClose, classification_type } = props;
  const { accounts } = useContext(moneyContext);

  const [newAccountId, setNewAccountId] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newAmountString, setNewAmountString] = useState("0");

  const newAccount = async () => {
    try {
      const response = await New(
        newAccountId,
        newName,
        newAmount,
        classification_type
      );

      const newClassification = {
        id: response.id,
        account_id: response.account_id,
        account_name: newAccountName,
        name: response.name,
        amount: response.amount,
        classification_type: response.classification_type,
      };

      onClassificationAdd(newClassification);
    } catch (error) {
      console.error("Failed to create classification:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setNewName(value);
        break;
      case "amount":
        setNewAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setNewAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      default:
        break;
    }
  };

  const handleAccountChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setNewAccountId(value);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setNewAccountName(selectedAccount.name);
    } else {
      setNewAccountName("");
    }
  };

  const handleSave = () => {
    newAccount();
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
            value={newName}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">支払い口座</Typography>
          <Select
            fullWidth
            value={newAccountId}
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
              value={newAmountString}
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
              作成
            </Button>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
