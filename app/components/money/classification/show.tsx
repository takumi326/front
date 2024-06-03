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
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";

import { moneyContext } from "@/context/money-context";

import { classificationEdit } from "@/lib/api/classification-api";

import { classificationMonthlyAmountEdit } from "@/lib/api/classificationMonthlyAmount-api";
import { classificationShowProps } from "@/interface/classification-interface";
import {
  classificationData,
  classificationMonthlyAmountData,
} from "@/interface/classification-interface";

export const ClassificationShow: React.FC<classificationShowProps> = (
  props
) => {
  const {
    id,
    account_id,
    account_name,
    name,
    date,
    classification_type,
    onClose,
    onDelete,
  } = props;
  const { accounts, classificationMonthlyAmounts, currentMonth, setIsEditing } =
    useContext(moneyContext);

  const [editAccountId, setEditAccountId] = useState(account_id);
  const [editAccountName, setEditAccountName] = useState(account_name);
  const [editName, setEditName] = useState(name);
  const [editDate, setEditDate] = useState<number>(Number(date));
  const [editAmount, setEditAmount] = useState<number>(
    classificationMonthlyAmounts.filter(
      (classificationMonthlyAmount) =>
        classificationMonthlyAmount.classification_id === id &&
        classificationMonthlyAmount.month === currentMonth
    )[0].amount
  );
  const [editAmountString, setEditAmountString] = useState<string>(
    String(
      Math.floor(
        classificationMonthlyAmounts.filter(
          (classificationMonthlyAmount) =>
            classificationMonthlyAmount.classification_id === id &&
            classificationMonthlyAmount.month === currentMonth
        )[0].amount
      )
    ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [completed, setCompleted] = useState<boolean>(false);

  const editClassification = async (id: string) => {
    const selectedClassificationMonthlyAmount: classificationMonthlyAmountData =
      classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id === id &&
          classificationMonthlyAmount.month === currentMonth
      )[0];
    try {
      if (completed === true) {
        await classificationEdit(
          id,
          editAccountId,
          editName,
          "即日",
          classification_type
        );
        await classificationMonthlyAmountEdit(
          selectedClassificationMonthlyAmount.id,
          selectedClassificationMonthlyAmount.classification_id,
          selectedClassificationMonthlyAmount.month,
          editAmount
        );
      } else {
        await classificationEdit(
          id,
          editAccountId,
          editName,
          String(editDate),
          classification_type
        );
        await classificationMonthlyAmountEdit(
          selectedClassificationMonthlyAmount.id,
          selectedClassificationMonthlyAmount.classification_id,
          selectedClassificationMonthlyAmount.month,
          editAmount
        );
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit classification:", error);
    }
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditAccountId(value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompleted(!completed);
  };

  // const handleSelectChange = (event: SelectChangeEvent<string>) => {
  //   const { name, value } = event.target;
  //   switch (name) {
  //     case "account":
  //       setEditAccountId(value);
  //       break;
  //     case "date":
  //       setEditDate(value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      case "date":
        setEditDate(Number(value));
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    editClassification(id);
    onClose();
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Box width={560} height={650}>
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
            name="account"
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
          {classification_type === "payment" ? (
            <Typography variant="subtitle1">支払い日</Typography>
          ) : (
            <Typography variant="subtitle1">振込み日</Typography>
          )}
          <div className="flex items-center">
            <TextField
              variant="outlined"
              name="date"
              value={editDate}
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
