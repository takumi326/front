"use client";
import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import moment from "moment";

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { moneyContext } from "@/context/money-context";

import { paymentDelete } from "@/lib/api/payment-api";
import { classificationDelete } from "@/lib/api/classification-api";
import {
  classificationMonthlyAmountNew,
  classificationMonthlyAmountEdit,
} from "@/lib/api/classificationMonthlyAmount-api";

import {
  repetitionMoneyEdit,
  repetitionMoneyDelete,
} from "@/lib/api/repetitionMoney-api";
import { repetitionMoneyRowProps } from "@/interface/repetitionMoney-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const RepetitionMoneyRow: React.FC<repetitionMoneyRowProps> = (
  props
) => {
  const { id, amount, repetition_schedule } = props;
  const {
    repetitionMoneies,
    payments,
    categories,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
  } = useContext(moneyContext);

  const [editRepetitionAmount, setEditRepetitionAmount] =
    useState<number>(amount);
  const [editRepetitionAmountString, setEditRepetitionAmountString] =
    useState<string>(
      String(Math.floor(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  const [editRepetitionAmountError, setEditRepetitionAmountError] =
    useState<boolean>(false);

  const [repetitionDialogOpen, setRepetitionDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (editRepetitionAmount > 0) {
      setEditRepetitionAmountError(false);
    } else {
      setEditRepetitionAmountError(true);
    }
  }, [editRepetitionAmount]);

  const editRepetition = async () => {
    const selectedRepetitionMoney = repetitionMoneies.filter(
      (repetitionMoney) => repetitionMoney.id === id
    )[0];
    try {
      await repetitionMoneyEdit(
        id,
        selectedRepetitionMoney.transaction_type,
        selectedRepetitionMoney.payment_id,
        selectedRepetitionMoney.income_id,
        selectedRepetitionMoney.transfer_id,
        editRepetitionAmount,
        selectedRepetitionMoney.repetition_schedule
      );
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionMoney:", error);
    }
  };

  const deleteRepetition = async () => {
    try {
      await repetitionMoneyDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionPayment:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        setEditRepetitionAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setEditRepetitionAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      default:
        break;
    }
  };

  const handleSchedulChange = async (date: Date) => {
    const selectedRepetitionMoney = repetitionMoneies.filter(
      (repetitionMoney) => repetitionMoney.id === id
    )[0];
    const stringDate = date.toLocaleDateString().split("T")[0];
    try {
      await repetitionMoneyEdit(
        id,
        selectedRepetitionMoney.transaction_type,
        selectedRepetitionMoney.payment_id,
        selectedRepetitionMoney.income_id,
        selectedRepetitionMoney.transfer_id,
        selectedRepetitionMoney.amount,
        stringDate
      );
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionMoney:", error);
    }
  };

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

  const handleRepetitionMoneyDialogOpen = () => {
    setRepetitionDialogOpen(true);
  };

  const handleRepetitionMoneyDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setEditRepetitionAmount(amount);
    setEditRepetitionAmountString(
      String(Math.floor(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const handleRepetitionMoneySave = () => {
    setRepetitionDialogOpen(false);
    editRepetition();
  };

  return (
    <React.Fragment>
      <Dialog
        open={repetitionDialogOpen}
        onClose={handleRepetitionMoneyDialogCancel}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "300px",
          },
        }}
      >
        <button
          onClick={handleRepetitionMoneyDialogCancel}
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </button>
        <DialogTitle sx={{ textAlign: "center" }}>金額設定</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              name="amount"
              value={editRepetitionAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            {editRepetitionAmountError && (
              <Typography align="left" variant="subtitle1">
                金額を0以上にして下さい
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => handleRepetitionMoneySave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={editRepetitionAmountError}
          >
            設定
          </Button>
        </DialogActions>
      </Dialog>

      <TableRow key={id}>
        <TableCell component="th" scope="row">
          <InputDateTime
            selectedDate={repetition_schedule}
            onChange={handleSchedulChange}
          />
        </TableCell>
        <TableCell>
          <button
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleRepetitionMoneyDialogOpen}
          >
            {formatAmountCommas(amount)}
          </button>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={deleteRepetition}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
