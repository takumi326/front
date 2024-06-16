"use client";
import React, { useState, useEffect, useContext, ChangeEvent } from "react";

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
  const [newMonthlyDate, setNewMonthlyDate] = useState("1");
  const [newMonthlyDateNumber, setNewMonthlyDateNumber] = useState<number>(1);
  const [newMonthlyDateError, setNewMonthlyDateError] =
    useState<boolean>(false);
  const [newMonthlyAmount, setNewMonthlyAmount] = useState<number>(0);
  const [newMonthlyAmountString, setNewMonthlyAmountString] = useState("0");
  const [newMonthlyAmountError, setNewMonthlyAmountError] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (newMonthlyAmount >= 0) {
      setNewMonthlyAmountError(false);
    } else {
      setNewMonthlyAmountError(true);
    }
  }, [newMonthlyAmount]);

  useEffect(() => {
    if (newMonthlyDateNumber > 0) {
      setNewMonthlyDateError(false);
    } else {
      setNewMonthlyDateError(true);
    }

    if (
      Number(currentMonth.slice(4)) === 1 ||
      Number(currentMonth.slice(4)) === 3 ||
      Number(currentMonth.slice(4)) === 5 ||
      Number(currentMonth.slice(4)) === 7 ||
      Number(currentMonth.slice(4)) === 8 ||
      Number(currentMonth.slice(4)) === 10 ||
      Number(currentMonth.slice(4)) === 12
    ) {
      if (newMonthlyDateNumber >= 32) {
        setNewMonthlyDateError(true);
      }
    } else if (
      Number(currentMonth.slice(4)) === 4 ||
      Number(currentMonth.slice(4)) === 6 ||
      Number(currentMonth.slice(4)) === 9 ||
      Number(currentMonth.slice(4)) === 11
    ) {
      if (newMonthlyDateNumber >= 31) {
        setNewMonthlyDateError(true);
      }
    } else {
      if (Number(currentMonth.slice(2, 4)) % 4 === 0) {
        if (newMonthlyDateNumber >= 30) {
          setNewMonthlyDateError(true);
        }
      } else {
        if (newMonthlyDateNumber >= 29) {
          setNewMonthlyDateError(true);
        }
      }
    }
    setNewMonthlyAmountError(false);
  }, [newMonthlyDateNumber]);

  const newClassification = async () => {
    setLoading(true);
    try {
      const response = await classificationNew(
        newAccountId,
        newName,
        classification_type
      );

      if (newAccountId === null) {
        await classificationMonthlyAmountNew(
          response.id,
          currentMonth,
          "-1",
          newMonthlyAmount
        );
      } else {
        await classificationMonthlyAmountNew(
          response.id,
          currentMonth,
          newMonthlyDate,
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

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setNewAccountId(value);
    if (newAccountId === null) {
      setNewMonthlyDateNumber(1);
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
        if (!/^\d+$/.test(value)) {
          setNewMonthlyAmountError(true);
        } else {
          setNewMonthlyAmountError(false);
        }
        setNewMonthlyAmountString(
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
        if (!/^\d+$/.test(value)) {
          setNewMonthlyDateError(true);
        } else {
          setNewMonthlyDateError(false);
        }
        setNewMonthlyDate(value);
        setNewMonthlyDateNumber(Number(value));
        break;
      default:
        break;
    }
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
              value={newMonthlyAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <span>円</span>
          </div>
          <li>
            {newMonthlyAmountError && (
              <Typography align="left" variant="subtitle1">
                金額を0以上にして下さい
              </Typography>
            )}
          </li>
        </li>
        {newAccountId && (
          <li className="pt-10">
            {classification_type === "payment" ? (
              <Typography variant="subtitle1">
                {currentMonth.slice(4)}支払い日
              </Typography>
            ) : (
              <Typography variant="subtitle1">
                {currentMonth.slice(4)}振込み日
              </Typography>
            )}
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="date"
                value={newMonthlyDate}
                onChange={handleChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <span>日</span>
            </div>
            {newMonthlyDateError && (
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
                !isFormValid || newMonthlyAmountError || newMonthlyDateError
              }
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
