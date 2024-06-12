"use client";
import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import moment from "moment";

import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { repetitionMoneyRowProps } from "@/interface/repetitionMoney-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const RepetitionMoneyRow: React.FC<repetitionMoneyRowProps> = (
  props
) => {
  const { id, amount, repetition_schedule, limitAmount, onChange, onDelete } =
    props;
  const { repetitionMoneies } = useContext(moneyContext);

  const [editRepetitionSchedule, setEditRepetitionSchedule] =
    useState(repetition_schedule);
  const [editRepetitionAmount, setEditRepetitionAmount] =
    useState<number>(amount);
  const [editRepetitionAmountString, setEditRepetitionAmountString] =
    useState<string>(
      String(Math.floor(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  const [editRepetitionAmountError, setEditRepetitionAmountError] =
    useState<boolean>(false);
  const [editRepetitionAmountOverError, setEditRepetitionAmountOverError] =
    useState<boolean>(false);

  const [repetitionDialogOpen, setRepetitionDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (editRepetitionAmount > 0) {
      setEditRepetitionAmountError(false);
    } else {
      setEditRepetitionAmountError(true);
    }

    if (limitAmount != -1 && limitAmount >= editRepetitionAmount) {
      setEditRepetitionAmountOverError(false);
    } else {
      setEditRepetitionAmountOverError(true);
    }
  }, [editRepetitionAmount]);

  // const editRepetition = async () => {
  //   const selectedRepetitionMoney = repetitionMoneies.filter(
  //     (repetitionMoney) => repetitionMoney.id === id
  //   )[0];
  //   try {
  //     await repetitionMoneyEdit(
  //       id,
  //       selectedRepetitionMoney.transaction_type,
  //       selectedRepetitionMoney.payment_id,
  //       selectedRepetitionMoney.income_id,
  //       selectedRepetitionMoney.transfer_id,
  //       editRepetitionAmount,
  //       selectedRepetitionMoney.repetition_schedule
  //     );
  //     setIsEditing(true);
  //   } catch (error) {
  //     console.error("Failed to delete repetitionMoney:", error);
  //   }
  // };

  // const deleteRepetition = async () => {
  //   try {
  //     await repetitionMoneyDelete(id);
  //     setIsEditing(true);
  //   } catch (error) {
  //     console.error("Failed to delete repetitionPayment:", error);
  //   }
  // };

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
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditRepetitionSchedule(stringDate);
    onChange(id, 0, stringDate);
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
    onChange(id, editRepetitionAmount, "");
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
            {editRepetitionAmountOverError && (
              <Typography align="left" variant="subtitle1">
                送金元口座に入っているお金以下にして下さい
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleRepetitionMoneySave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={
              editRepetitionAmountError || editRepetitionAmountOverError
            }
          >
            設定
          </Button>
        </DialogActions>
      </Dialog>

      <TableRow
        key={id}
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor:
              repetitionMoneies.filter(
                (repetitionMoney) => repetitionMoney.id === id
              )[0].transfer_id === null
                ? "#f5f5f5"
                : new Date(repetition_schedule).getTime() >
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    23,
                    59,
                    0,
                    0
                  ).getTime()
                ? "#bfbfbf"
                : "#f5f5f5",
          },
        }}
      >
        <TableCell component="th" scope="row">
          <InputDateTime
            selectedDate={editRepetitionSchedule}
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
            {formatAmountCommas(editRepetitionAmount)}
          </button>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => onDelete(id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
