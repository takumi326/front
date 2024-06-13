"use client";
import React, { useState, useContext, ChangeEvent } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { moneyContext } from "@/context/money-context";

import { classificationNew } from "@/lib/api/classification-api";
import { classificationMonthlyAmountNew } from "@/lib/api/classificationMonthlyAmount-api";
import { classificationNewProps } from "@/interface/classification-interface";

export const ClassificationNew: React.FC<classificationNewProps> = (props) => {
  const { onClose, classification_type } = props;
  const { accounts, currentMonth, setIsEditing, setLoading } =
    useContext(moneyContext);

  const [newAccountId, setNewAccountId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState<number>(0);
  const [newMonthlyAmount, setNewMonthlyAmount] = useState<number>(0);
  const [newMonthlAmountString, setNewMonthlAmountString] = useState("0");
  const [isFormValid, setIsFormValid] = useState(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const newClassification = async () => {
    setLoading(true);
    try {
      if (completed === true) {
        const response = await classificationNew(
          newAccountId,
          newName,
          classification_type
        );
        await classificationMonthlyAmountNew(
          response.id,
          currentMonth,
          "即日",
          newMonthlyAmount
        );
      } else {
        const response = await classificationNew(
          newAccountId,
          newName,
          classification_type
        );
        await classificationMonthlyAmountNew(
          response.id,
          currentMonth,
          String(newDate),
          newMonthlyAmount
        );
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create classification:", error);
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
      case "amount":
        setNewMonthlAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setNewMonthlyAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "date":
        setNewDate(Number(value));
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompleted(!completed);
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setNewAccountId(value);
    setNewDate(1);
  };

  const handleSave = () => {
    newClassification();
    onClose();
  };

  return (
    <Box width={560} height={650}>
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
          {classification_type === "payment" ? (
            <Typography variant="subtitle1">支払い口座</Typography>
          ) : (
            <Typography variant="subtitle1">振込用口座</Typography>
          )}
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
              value={newMonthlAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <span>円</span>
          </div>
        </li>
        {newAccountId && (
          <li className="pt-10">
            {classification_type === "payment" ? (
              <Typography variant="subtitle1">支払い日</Typography>
            ) : (
              <Typography variant="subtitle1">振込み日</Typography>
            )}
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="date"
                value={newDate}
                onChange={handleChange}
                disabled={completed}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <span>日</span>
            </div>
            <Stack direction="row" alignItems="center">
              <Checkbox
                checked={completed}
                onChange={handleCheckboxChange}
                color="primary"
              />
              <Typography>即日反映</Typography>
            </Stack>
          </li>
        )}
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
