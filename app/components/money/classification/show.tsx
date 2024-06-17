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
  const {
    id,
    account_id,
    name,
    classification_type,
    calendarMonth,
    onClose,
    onDelete,
  } = props;
  const {
    accounts,
    classifications,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
    setLoading,
  } = useContext(moneyContext);

  const viewMonth = calendarMonth != "" ? calendarMonth : currentMonth;

  const classificationMonthlyAmount: classificationMonthlyAmountData =
    classificationMonthlyAmounts.filter(
      (classificationMonthlyAmount) =>
        classificationMonthlyAmount.classification_id === id &&
        classificationMonthlyAmount.month === viewMonth
    )[0];

  const [editAccountId, setEditAccountId] = useState(account_id);
  const [editName, setEditName] = useState(name);
  const [editNameError, setEditNameError] = useState<boolean>(false);
  const [editMonthlyDate, setEditMonthlyDate] = useState(
    classificationMonthlyAmount.date
  );
  const [editMonthlyDateNumber, setEditMonthlyDateNumber] = useState<number>(
    Number(classificationMonthlyAmount.date)
  );
  const [editMonthlyDateError, setEditMonthlyDateError] =
    useState<boolean>(false);
  const [editMonthlyAmount, setEditMonthlyAmount] = useState<number>(
    classificationMonthlyAmount.amount
  );
  const [editMonthlyAmountString, setEditMonthlyAmountString] =
    useState<string>(
      String(Math.floor(classificationMonthlyAmount.amount)).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      )
    );
  const [editMonthlyAmountError, setEditMonthlyAmountError] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const classification = classifications.filter(
      (classification) =>
        classification.name === editName &&
        classification.classification_type === classification_type
    )[0];
    if (classification != undefined) {
      if (classification.id != id) {
        setEditNameError(true);
      }
    } else {
      setEditNameError(false);
    }
  }, [editName]);

  useEffect(() => {
    if (editMonthlyAmount >= 0) {
      setEditMonthlyAmountError(false);
    } else {
      setEditMonthlyAmountError(true);
    }
  }, [editMonthlyAmount]);

  useEffect(() => {
    if (editMonthlyDateNumber > 0 || editMonthlyDateNumber === -1) {
      setEditMonthlyDateError(false);
    } else {
      setEditMonthlyDateError(true);
    }

    if (
      Number(viewMonth.slice(4)) === 1 ||
      Number(viewMonth.slice(4)) === 3 ||
      Number(viewMonth.slice(4)) === 5 ||
      Number(viewMonth.slice(4)) === 7 ||
      Number(viewMonth.slice(4)) === 8 ||
      Number(viewMonth.slice(4)) === 10 ||
      Number(viewMonth.slice(4)) === 12
    ) {
      if (editMonthlyDateNumber >= 32) {
        setEditMonthlyDateError(true);
      }
    } else if (
      Number(viewMonth.slice(4)) === 4 ||
      Number(viewMonth.slice(4)) === 6 ||
      Number(viewMonth.slice(4)) === 9 ||
      Number(viewMonth.slice(4)) === 11
    ) {
      if (editMonthlyDateNumber >= 31) {
        setEditMonthlyDateError(true);
      }
    } else {
      if (Number(viewMonth.slice(2, 4)) % 4 === 0) {
        if (editMonthlyDateNumber >= 30) {
          setEditMonthlyDateError(true);
        }
      } else {
        if (editMonthlyDateNumber >= 29) {
          setEditMonthlyDateError(true);
        }
      }
    }
    setEditMonthlyAmountError(false);
  }, [editMonthlyDateNumber, editAccountId]);

  const editClassification = async (id: string) => {
    setLoading(true);
    try {
      await classificationEdit(
        id,
        editAccountId,
        editName,
        classification_type
      );

      if (editAccountId === null) {
        await classificationMonthlyAmountEdit(
          classificationMonthlyAmount.id,
          classificationMonthlyAmount.classification_id,
          classificationMonthlyAmount.month,
          "-1",
          editMonthlyAmount
        );
      } else {
        await classificationMonthlyAmountEdit(
          classificationMonthlyAmount.id,
          classificationMonthlyAmount.classification_id,
          classificationMonthlyAmount.month,
          editMonthlyDate,
          editMonthlyAmount
        );
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit classification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditAccountId(value);
    if (editAccountId === null) {
      setEditMonthlyDate("1");
      setEditMonthlyDateNumber(1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setEditName(value);
        setIsFormValid(value.trim().length > 0);
        break;
      case "amount":
        if (!/^\d+$/.test(value)) {
          setEditMonthlyAmountError(true);
        } else {
          setEditMonthlyAmountError(false);
        }
        setEditMonthlyAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setEditMonthlyAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "date":
        if (!/^\d+$/.test(value)) {
          setEditMonthlyDateError(true);
        } else {
          setEditMonthlyDateError(false);
        }
        setEditMonthlyDate(value);
        setEditMonthlyDateNumber(Number(value));
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
        <li>
          {editNameError && (
            <Typography align="left" variant="subtitle1">
              同じ名称は作成できません
            </Typography>
          )}
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
              value={editMonthlyAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <span>円</span>
          </div>
          <li>
            {editMonthlyAmountError && (
              <Typography align="left" variant="subtitle1">
                金額を0以上にして下さい
              </Typography>
            )}
          </li>
        </li>
        {editAccountId && (
          <li className="pt-10">
            {classification_type === "payment" ? (
              <Typography variant="subtitle1">
                {viewMonth.slice(4)}月支払い日
              </Typography>
            ) : (
              <Typography variant="subtitle1">
                {viewMonth.slice(4)}月振込み日
              </Typography>
            )}
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="date"
                value={editMonthlyDate}
                onChange={handleChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <span>日</span>
            </div>
            {editMonthlyDateError && (
              <Typography align="left" variant="subtitle1">
                存在する日付にして下さい
              </Typography>
            )}
          </li>
        )}
        <li className="pt-10">
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                !isFormValid || editMonthlyAmountError || editMonthlyDateError
              }
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
