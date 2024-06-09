"use client";
import React, { useState, useEffect, useContext, ChangeEvent } from "react";

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
import { classificationMonthlyAmountData } from "@/interface/classification-interface";

export const ClassificationShow: React.FC<classificationShowProps> = (
  props
) => {
  const { id, account_id, name, classification_type, onClose, onDelete } =
    props;
  const { accounts, classificationMonthlyAmounts, currentMonth, setIsEditing } =
    useContext(moneyContext);

  const classificationMonthlyAmount: classificationMonthlyAmountData =
    classificationMonthlyAmounts.filter(
      (classificationMonthlyAmount) =>
        classificationMonthlyAmount.classification_id === id &&
        classificationMonthlyAmount.month === currentMonth
    )[0];

  const [editAccountId, setEditAccountId] = useState(account_id);
  const [editName, setEditName] = useState(name);
  // const [editDate, setEditDate] = useState(classificationMonthlyAmount.date);
  const [editDateNumber, setEditDateNumber] = useState<number>(
    classificationMonthlyAmount.date === "即日"
      ? 0
      : Number(classificationMonthlyAmount.date)
  );
  const [editAmount, setEditAmount] = useState<number>(
    classificationMonthlyAmount.amount
  );
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(classificationMonthlyAmount.amount)).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )
  );
  const [isFormValid, setIsFormValid] = useState(true);
  // const [completed, setCompleted] = useState<boolean>(
  //   classificationMonthlyAmount.date === "即日" ? true : false
  // );

  useEffect(() => {
    if (editAccountId === null) {
      setEditDateNumber(0);
    } else {
      if (editDateNumber >= 32) {
        setEditDateNumber(31);
      } else if (editDateNumber <= 0) {
        setEditDateNumber(1);
      }
    }
  }, [editDateNumber]);

  // useEffect(() => {
  //   if (editDate === "即日") {
  //     setEditDateNumber(0);
  //   }
  // }, [editDate]);

  const editClassification = async (id: string) => {
    try {
      // if (completed === true) {
      //   await classificationEdit(
      //     id,
      //     editAccountId,
      //     editName,
      //     classification_type
      //   );
      //   await classificationMonthlyAmountEdit(
      //     classificationMonthlyAmount.id,
      //     classificationMonthlyAmount.classification_id,
      //     classificationMonthlyAmount.month,
      //     editDate,
      //     editAmount
      //   );
      // } else {
      await classificationEdit(
        id,
        editAccountId,
        editName,
        classification_type
      );
      await classificationMonthlyAmountEdit(
        classificationMonthlyAmount.id,
        classificationMonthlyAmount.classification_id,
        classificationMonthlyAmount.month,
        String(editDateNumber),
        editAmount
      );
      // }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit classification:", error);
    }
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditAccountId(value);
    if (editAccountId === null) {
      setEditDateNumber(1);
    }
  };

  // const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setCompleted(!completed);
  //   if (completed === false) {
  //     setEditDate("即日");
  //     setEditDateNumber(0);
  //   } else {
  //     setEditDate("");
  //     setEditDateNumber(1);
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
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
      case "date":
        setEditDateNumber(Number(value));
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
        {editAccountId && (
          <li className="pt-10">
            {classification_type === "payment" ? (
              <Typography variant="subtitle1">
                {currentMonth.slice(4)}月支払い日
              </Typography>
            ) : (
              <Typography variant="subtitle1">
                {currentMonth.slice(4)}月振込み日
              </Typography>
            )}
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="date"
                value={editDateNumber}
                onChange={handleChange}
                // disabled={completed}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <span>日</span>
            </div>
            {/* <Stack direction="row" alignItems="center">
              <Checkbox
                checked={completed}
                onChange={handleCheckboxChange}
                color="primary"
              />
              <Typography>即日反映</Typography>
            </Stack> */}
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
              保存
            </Button>
            <IconButton
              onClick={() => onDelete(id)}
              className="absolute right-0 bottom-0 m-8"
            >
              <DeleteIcon />
            </IconButton>{" "}
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
