"use client";
import React, { useState, ChangeEvent, useContext, useEffect } from "react";

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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import {
  repetitionMoneyNew,
  repetitionMoneyDelete,
} from "@/lib/api/repetitionMoney-api";
import { transferEdit, transferDelete } from "@/lib/api/transfer-api";
import { accountEdit } from "@/lib/api/account-api";
import { transferShowProps } from "@/interface/transfer-interface";

import { accountData } from "@/interface/account-interface";

import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";
import { RepetitionMoneyRow } from "@/components/money/repetitionMoney/row";

export const TransferShow: React.FC<transferShowProps> = (props) => {
  const {
    id,
    before_account_id,
    after_account_id,
    amount,
    schedule,
    end_date,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    onClose,
  } = props;
  const { accounts, repetitionMoneies, setIsEditing } =
    useContext(moneyContext);
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();

  const [repetitionDialogOpen, setRepetitionDialogOpen] =
    useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(
    repetition_settings && Number(repetition_settings[0])
      ? Number(repetition_settings[0])
      : 1
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    repetition_settings && repetition_settings.length > 1
      ? repetition_settings.slice(1)
      : []
  );
  const [period, setPeriod] = useState(repetition_type ? repetition_type : "");

  const initialAmount = amount;
  const initialBeforeAccountId = before_account_id;
  const initialAfterAccountId = after_account_id;
  const initialSchedule = schedule;
  const initialRepetition = repetition;

  const [editBeforeAccountId, setEditBeforeAccountId] =
    useState(before_account_id);
  const [editBeforeAccountAmount, setEditBeforeAccountAmount] =
    useState<number>(
      accounts.filter((account) => account.id === before_account_id)[0].amount
    );
  const [editAfterAccountId, setEditAfterAccountId] =
    useState(after_account_id);
  const [editAmount, setEditAmount] = useState(amount);
  const [editAmountString, setEditAmountString] = useState(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editAmountOverError, setEditAmountOverError] =
    useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState(schedule);
  const [editEndDate, setEditEndDate] = useState(end_date);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState<string[]>(repetition_settings);
  const [editBody, setEditBody] = useState(body);
  const [isBeforeTitleFormValid, setIsBeforeTitleFormValid] =
    useState<boolean>(false);
  const [isAfterTitleFormValid, setIsAfterTitleFormValid] =
    useState<boolean>(false);

  useEffect(() => {
    console.log(editRepetition);
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }

    if (editBeforeAccountAmount >= editAmount) {
      setEditAmountOverError(false);
    } else {
      setEditAmountOverError(true);
    }
  }, [editAmount, editBeforeAccountAmount]);

  const editTransfer = async (id: string) => {
    const initialBeforeAccount: accountData = accounts.filter(
      (account) => account.id === initialBeforeAccountId
    )[0];

    const initialAfterAccount: accountData = accounts.filter(
      (account) => account.id === initialAfterAccountId
    )[0];

    const editBeforeAccount: accountData = accounts.filter(
      (account) => account.id === editBeforeAccountId
    )[0];

    const editAfterAccount: accountData = accounts.filter(
      (account) => account.id === editAfterAccountId
    )[0];

    const initialRepetitionDelete = async () =>
      await Promise.all(
        repetitionMoneies
          .filter((repetitionMoney) => repetitionMoney.transfer_id === id)
          .map((repetitionMoney) => {
            repetitionMoneyDelete(repetitionMoney.id);
          })
      );

    let repetitionMoneyDate: repetitionMoneyData[] = [];

    const editRepetitionAdd = async () => {
      const schedules = calculateNextSchedules();
      await Promise.all(
        schedules.map(async (schedule) => {
          const stringDate = new Date(schedule)
            .toLocaleDateString()
            .split("T")[0];
          const repetitionMoney = await repetitionMoneyNew(
            "transfer",
            "",
            "",
            id,
            editAmount,
            stringDate
          );
          repetitionMoneyDate = [...repetitionMoneyDate, repetitionMoney];
        })
      );
    };

    const now = new Date();
    const endOfCurrentDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      0,
      0
    );

    const initialRepetitionMoney = async () => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneies.filter(
        (repetitionMoney) =>
          repetitionMoney.transaction_type === "transfer" &&
          repetitionMoney.transfer_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            endOfCurrentDay.getTime()
      )) {
        money += parseFloat(String(repetitionMoney.amount));
      }
      return money;
    };

    const editRepetitionMoney = async () => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneyDate.filter(
        (repetitionMoney) =>
          new Date(repetitionMoney.repetition_schedule).getTime() <=
          endOfCurrentDay.getTime()
      )) {
        money += parseFloat(String(repetitionMoney.amount));
      }
      return money;
    };

    const initialMoney =
      new Date(initialSchedule).getTime() <= endOfCurrentDay.getTime()
        ? parseFloat(String(initialAmount))
        : 0;

    const editMoney =
      new Date(editSchedule).getTime() <= endOfCurrentDay.getTime()
        ? parseFloat(String(editAmount))
        : 0;

    try {
      await transferEdit(
        id,
        editBeforeAccountId,
        editAfterAccountId,
        editAmount,
        editSchedule,
        editEndDate,
        editRepetition,
        editRepetitionType,
        editRepetitionSettings,
        editBody
      );

      if (initialBeforeAccountId === editBeforeAccountId) {
        let money = parseFloat(String(initialBeforeAccount.amount));
        if (editRepetition === true) {
          if (initialRepetition === true) {
            await initialRepetitionDelete();
            await editRepetitionAdd();

            money =
              money +
              (await initialRepetitionMoney()) -
              (await editRepetitionMoney());

            await accountEdit(
              initialBeforeAccount.id,
              initialBeforeAccount.name,
              Math.max(0, money),
              initialBeforeAccount.body
            );
          } else {
            editRepetitionAdd();

            money = money + initialMoney - (await editRepetitionMoney());

            await accountEdit(
              initialBeforeAccount.id,
              initialBeforeAccount.name,
              Math.max(0, money),
              initialBeforeAccount.body
            );
          }
        } else {
          if (initialRepetition === true) {
            initialRepetitionDelete();

            money = money + (await initialRepetitionMoney()) - editMoney;

            money = money + parseFloat(String(editAmount));
            await accountEdit(
              initialBeforeAccount.id,
              initialBeforeAccount.name,
              Math.max(0, money),
              initialBeforeAccount.body
            );
          } else {
            money = money + initialMoney - editMoney;

            await accountEdit(
              initialBeforeAccount.id,
              initialBeforeAccount.name,
              Math.max(0, money),
              initialBeforeAccount.body
            );
          }
        }
      } else {
        let initialBeforeMoney = parseFloat(
          String(initialBeforeAccount.amount)
        );
        if (initialRepetition === true) {
          initialRepetitionDelete();

          initialBeforeMoney =
            initialBeforeMoney + (await initialRepetitionMoney());

          await accountEdit(
            initialBeforeAccount.id,
            initialBeforeAccount.name,
            Math.max(0, initialBeforeMoney),
            initialBeforeAccount.body
          );
        } else {
          initialBeforeMoney = initialBeforeMoney + initialMoney;

          await accountEdit(
            initialBeforeAccount.id,
            initialBeforeAccount.name,
            Math.max(0, initialBeforeMoney),
            initialBeforeAccount.body
          );
        }

        let editBeforeMoney = parseFloat(String(editBeforeAccount.amount));
        if (editRepetition === true) {
          editRepetitionAdd();

          editBeforeMoney = editBeforeMoney + (await editRepetitionMoney());

          await accountEdit(
            editBeforeAccount.id,
            editBeforeAccount.name,
            Math.max(0, editBeforeMoney),
            editBeforeAccount.body
          );
        } else {
          editBeforeMoney = editBeforeMoney + editMoney;

          await accountEdit(
            editBeforeAccount.id,
            editBeforeAccount.name,
            Math.max(0, editBeforeMoney),
            editBeforeAccount.body
          );
        }
      }

      if (initialAfterAccountId === editAfterAccountId) {
        let money = parseFloat(String(initialAfterAccount.amount));
        if (editRepetition === true) {
          if (initialRepetition === true) {
            await initialRepetitionDelete();
            await editRepetitionAdd();

            money =
              money -
              (await initialRepetitionMoney()) +
              (await editRepetitionMoney());

            await accountEdit(
              initialAfterAccount.id,
              initialAfterAccount.name,
              Math.max(0, money),
              initialAfterAccount.body
            );
          } else {
            editRepetitionAdd();

            money = money - initialMoney + (await editRepetitionMoney());

            await accountEdit(
              initialAfterAccount.id,
              initialAfterAccount.name,
              Math.max(0, money),
              initialAfterAccount.body
            );
          }
        } else {
          if (initialRepetition === true) {
            initialRepetitionDelete();

            money = money - (await initialRepetitionMoney()) + editMoney;

            money = money + parseFloat(String(editAmount));
            await accountEdit(
              initialAfterAccount.id,
              initialAfterAccount.name,
              Math.max(0, money),
              initialAfterAccount.body
            );
          } else {
            money = money - initialMoney + editMoney;

            await accountEdit(
              initialAfterAccount.id,
              initialAfterAccount.name,
              Math.max(0, money),
              initialAfterAccount.body
            );
          }
        }
      } else {
        let initialAfterMoney = parseFloat(String(initialAfterAccount.amount));
        if (initialRepetition === true) {
          initialRepetitionDelete();

          initialAfterMoney =
            initialAfterMoney - (await initialRepetitionMoney());

          await accountEdit(
            initialAfterAccount.id,
            initialAfterAccount.name,
            Math.max(0, initialAfterMoney),
            initialAfterAccount.body
          );
        } else {
          initialAfterMoney = initialAfterMoney - initialMoney;

          await accountEdit(
            initialAfterAccount.id,
            initialAfterAccount.name,
            Math.max(0, initialAfterMoney),
            initialAfterAccount.body
          );
        }

        let editAfterMoney = parseFloat(String(editAfterAccount.amount));
        if (editRepetition === true) {
          editRepetitionAdd();

          editAfterMoney = editAfterMoney + (await editRepetitionMoney());

          await accountEdit(
            editAfterAccount.id,
            editAfterAccount.name,
            Math.max(0, editAfterMoney),
            editAfterAccount.body
          );
        } else {
          editAfterMoney = editAfterMoney + editMoney;

          await accountEdit(
            editAfterAccount.id,
            editAfterAccount.name,
            Math.max(0, editAfterMoney),
            editAfterAccount.body
          );
        }
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit transfer:", error);
    }
  };

  const handleTransferDelete = async (id: string) => {
    const initialBeforeAccount: accountData = accounts.filter(
      (account) => account.id === initialBeforeAccountId
    )[0];

    const initialAfterAccount: accountData = accounts.filter(
      (account) => account.id === initialAfterAccountId
    )[0];

    const now = new Date();
    const endOfCurrentDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      0,
      0
    );

    const initialRepetitionMoney = async () => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneies.filter(
        (repetitionMoney) =>
          repetitionMoney.transaction_type === "transfer" &&
          repetitionMoney.transfer_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            endOfCurrentDay.getTime()
      )) {
        money += parseFloat(String(repetitionMoney.amount));
      }
      return money;
    };

    const initialMoney =
      new Date(initialSchedule).getTime() <= endOfCurrentDay.getTime()
        ? parseFloat(String(initialAmount))
        : 0;

    try {
      if (initialRepetition === true) {
        let initialBeforeMoney = parseFloat(
          String(initialBeforeAccount.amount)
        );
        let initialAfterMoney = parseFloat(String(initialAfterAccount.amount));

        initialBeforeMoney =
          initialBeforeMoney + (await initialRepetitionMoney());
        initialAfterMoney =
          initialAfterMoney - (await initialRepetitionMoney());

        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialBeforeMoney),
          initialBeforeAccount.body
        );

        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialAfterMoney),
          initialBeforeAccount.body
        );
      } else {
        let initialBeforeMoney = parseFloat(
          String(initialBeforeAccount.amount)
        );
        let initialAfterMoney = parseFloat(String(initialAfterAccount.amount));

        initialBeforeMoney = initialBeforeMoney + initialMoney;
        initialAfterMoney = initialAfterMoney - initialMoney;

        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialBeforeMoney),
          initialBeforeAccount.body
        );

        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialAfterMoney),
          initialBeforeAccount.body
        );
      }
      transferDelete(id);
      setIsEditing(true);
      onClose();
    } catch (error) {
      console.error("Failed to edit transfer:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
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
      case "body":
        setEditBody(value);
        break;
      default:
        break;
    }
  };

  const handleBeforeAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditBeforeAccountId(value);
    setIsBeforeTitleFormValid(false);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setEditBeforeAccountAmount(selectedAccount.amount);
    } else {
      setEditBeforeAccountAmount(0);
    }
  };

  const handleAfterAccountChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditAfterAccountId(value);
    setIsAfterTitleFormValid(false);
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

  const handleRepetitionDialogOpen = () => {
    setRepetitionDialogOpen(true);
  };

  const handleRepetitionDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setFrequency(
      editRepetitionSettings && Number(editRepetitionSettings[0])
        ? Number(editRepetitionSettings[0])
        : 1
    );
    setSelectedDays(
      editRepetitionSettings && editRepetitionSettings.length > 1
        ? editRepetitionSettings.slice(1)
        : []
    );
    setPeriod(editRepetitionType ? editRepetitionType : "daily");
  };

  const handleRepetitionDialogDelete = async () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(false);
    setEditRepetitionType("");
    setEditRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("daily");
    setEditEndDate(endDateObject);
    try {
      await Promise.all(
        repetitionMoneies
          .filter((repetitionMoney) => repetitionMoney.transfer_id === id)
          .map((repetitionMoney) => repetitionMoneyDelete(repetitionMoney.id))
      );
    } catch (error) {
      console.error("Failed to delete repetitionMoney:", error);
    }
  };

  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(true);
    setEditRepetitionType(period);
    setEditRepetitionSettings([frequency.toString(), ...selectedDays]);
  };

  const handleSchedulChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditSchedule(stringDate);
  };

  const handleEndDateChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      stringDate = endDateObject;
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }
    setEditEndDate(stringDate);
  };

  const handleSave = () => {
    if (editAmount > 0) {
      editTransfer(id);
      onClose();
    } else {
      setEditAmountError(true);
    }
  };

  const handleFrequencyChange = (delta: number) => {
    setFrequency((prev) => Math.max(1, prev + delta));
  };

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: string | null
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      if (newPeriod !== "weekly") {
        setSelectedDays([]);
      }
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev.filter((d) => d !== day), day].sort((a, b) => {
            const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];
            return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
          })
    );
  };

  const calculateNextSchedules = () => {
    const mapDayOfWeekToInt = (dayOfWeek: string) => {
      switch (dayOfWeek) {
        case "月":
          return 1;
        case "火":
          return 2;
        case "水":
          return 3;
        case "木":
          return 4;
        case "金":
          return 5;
        case "土":
          return 6;
        case "日":
          return 0;
        default:
          return NaN;
      }
    };

    const startDate = new Date(editSchedule);
    const endDate = new Date(editEndDate);
    endDate.setHours(23, 59, 59, 999);
    let schedules = [];
    let currentDate = startDate;
    const repetitionWeek = editRepetitionSettings.slice(1).length;
    let times = 1;

    while (currentDate <= endDate) {
      schedules.push(new Date(currentDate).toLocaleDateString().split("T")[0]);

      switch (editRepetitionType) {
        case "daily":
          currentDate.setDate(
            currentDate.getDate() + Number(editRepetitionSettings[0])
          );
          break;

        case "weekly":
          const targetDaysOfWeek = editRepetitionSettings
            .slice(1)
            .map(mapDayOfWeekToInt);
          let currentDayOfWeek = currentDate.getDay();
          let nextDayOfWeek = currentDayOfWeek;

          const repetitionTimes = 7 * (Number(editRepetitionSettings[0]) - 1);
          if (repetitionWeek === 1 || times === 1) {
            for (let i = 1; i <= 7; i++) {
              nextDayOfWeek = (currentDayOfWeek + i) % 7;
              if (targetDaysOfWeek.includes(nextDayOfWeek)) {
                currentDate.setDate(
                  currentDate.getDate() + i + repetitionTimes
                );
                times += 1;
                break;
              }
            }
          } else {
            for (let i = 1; i <= 7; i++) {
              nextDayOfWeek = (currentDayOfWeek + i) % 7;
              if (targetDaysOfWeek.includes(nextDayOfWeek)) {
                currentDate.setDate(currentDate.getDate() + i);
                if (times === repetitionWeek) {
                  times = 1;
                } else if (times < repetitionWeek) {
                  times += 1;
                }
                break;
              }
            }
          }
          break;

        case "monthly":
          let nextMonth =
            currentDate.getMonth() + Number(editRepetitionSettings[0]);
          let nextYear = currentDate.getFullYear();
          if (nextMonth > 11) {
            nextYear += Math.floor(nextMonth / 12);
            nextMonth = nextMonth % 12;
          }
          const daysInNextMonth = new Date(
            nextYear,
            nextMonth + 1,
            0
          ).getDate();
          currentDate = new Date(
            nextYear,
            nextMonth,
            Math.min(currentDate.getDate(), daysInNextMonth)
          );
          break;

        default:
          return schedules;
      }
    }

    return schedules;
  };
  const isDialogFormValid =
    period === "daily" ||
    period === "monthly" ||
    (period === "weekly" && selectedDays.length > 0);

  const sortedRows = repetitionMoneies
    .filter((repetitionMoney) => repetitionMoney.transfer_id === id)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.repetition_schedule).getTime();
      const dateB = new Date(b.repetition_schedule).getTime();
      return dateA - dateB;
    });

  return (
    <Box
      sx={{
        width:
          editRepetition === true &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.transfer_id === id
          ).length > 0
            ? 1000
            : 560,
        height: 800,
      }}
    >
      <Dialog
        open={repetitionDialogOpen}
        onClose={handleRepetitionDialogCancel}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "350px",
          },
        }}
      >
        <button
          onClick={handleRepetitionDialogCancel}
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </button>
        <DialogTitle sx={{ textAlign: "center" }}>繰り返しの設定</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => handleFrequencyChange(-1)}>
                <RemoveIcon />
              </IconButton>
              <Typography>{frequency}</Typography>
              <IconButton onClick={() => handleFrequencyChange(1)}>
                <AddIcon />
              </IconButton>
              <ToggleButtonGroup
                value={period}
                exclusive
                onChange={handlePeriodChange}
                aria-label="period"
              >
                <ToggleButton value="daily">日</ToggleButton>
                <ToggleButton value="weekly">週</ToggleButton>
                <ToggleButton value="monthly">月</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {period === "weekly" && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {["日", "月", "火", "水", "木", "金", "土"].map(
                  (day, index) => (
                    <ToggleButton
                      key={day}
                      value={day}
                      selected={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    >
                      {day}
                    </ToggleButton>
                  )
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleRepetitionDialogDelete}
            sx={{
              minWidth: 120,
              border: "1px solid #f44336",
              color: "#f44336",
            }}
          >
            削除
          </Button>
          <Button
            onClick={handleRepetitionSave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={!isDialogFormValid}
          >
            設定
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={5}>
        <ul className="w-full">
          <li className="pt-10">
            <Typography variant="subtitle1">送金元口座</Typography>
            <Select
              fullWidth
              value={editBeforeAccountId}
              onChange={handleBeforeAccountChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {accounts
                .filter((account) => account.id !== editAfterAccountId)
                .map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
            </Select>
            {accounts
              .filter((account) => account.id === editBeforeAccountId)
              .map((account) => (
                <Typography key={account.id} align="left" variant="subtitle1">
                  口座金額：{formatAmountCommas(account.amount)}
                </Typography>
              ))}{" "}
            {isBeforeTitleFormValid && (
              <Typography align="left" variant="subtitle1">
                送金元口座を選択してください
              </Typography>
            )}
          </li>
          <li className="pt-5">
            <Typography variant="subtitle1">送金先口座</Typography>
            <Select
              fullWidth
              value={editAfterAccountId}
              onChange={handleAfterAccountChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {accounts
                .filter((account) => account.id !== editBeforeAccountId)
                .map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
            </Select>
            {accounts
              .filter((account) => account.id === editAfterAccountId)
              .map((account) => (
                <Typography key={account.id} align="left" variant="subtitle1">
                  口座金額：{formatAmountCommas(account.amount)}
                </Typography>
              ))}{" "}
            {isAfterTitleFormValid && (
              <Typography align="left" variant="subtitle1">
                送金先口座を選択してください
              </Typography>
            )}
          </li>
          <li className="pt-5">
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
          <li>
            <Typography align="left" variant="subtitle1">
              {editAmountError && (
                <Typography align="left" variant="subtitle1">
                  金額を0より上にしてください
                </Typography>
              )}
              {editAmountOverError && (
                <Typography align="left" variant="subtitle1">
                  送金元口座に入っているお金以下にして下さい
                </Typography>
              )}
            </Typography>
          </li>
          <li className="pt-5">
            <Stack direction="row" spacing={1}>
              <button
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={handleRepetitionDialogOpen}
              >
                繰り返し
              </button>
              {editRepetition === true ? (
                <Typography align="left" variant="subtitle1">
                  ON
                </Typography>
              ) : (
                <Typography align="left" variant="subtitle1">
                  OFF
                </Typography>
              )}
            </Stack>
            <Typography>
              {editRepetitionSettings && (
                <>
                  {editRepetitionType === "daily" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎日`}
                  {editRepetitionType === "weekly" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎週 ${editRepetitionSettings.slice(1).join(" ")}`}
                  {editRepetitionType === "monthly" &&
                    Number(editRepetitionSettings[0]) === 1 &&
                    `毎月`}
                  {Number(editRepetitionSettings[0]) > 1 &&
                    editRepetitionSettings &&
                    `毎${editRepetitionSettings[0]}${
                      editRepetitionType === "daily"
                        ? "日"
                        : editRepetitionType === "weekly"
                        ? `週 ${editRepetitionSettings.slice(1).join(" ")}`
                        : "月"
                    }`}
                </>
              )}
            </Typography>
          </li>
          <li className="pt-5">
            {editRepetition === true ? (
              <Typography variant="subtitle1">繰り返し開始日</Typography>
            ) : (
              <Typography variant="subtitle1">予定</Typography>
            )}
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                borderWidth: "px",
              }}
            >
              <InputDateTime
                selectedDate={editSchedule}
                onChange={handleSchedulChange}
              />
            </Box>
          </li>
          {editRepetition === true && (
            <li className="pt-5">
              <Typography variant="subtitle1">繰り返し終了日</Typography>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  borderWidth: "px",
                }}
              >
                <InputDateTime
                  selectedDate={editEndDate}
                  onChange={handleEndDateChange}
                />
              </Box>
              <Typography>※設定できるのは最大で今日から5年後です</Typography>
            </li>
          )}
          <li className="pt-5">
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
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={
                  isBeforeTitleFormValid ||
                  isAfterTitleFormValid ||
                  editAmountError ||
                  editAmountOverError
                }
                color="primary"
                className={
                  editRepetition === true &&
                  repetitionMoneies.filter(
                    (repetitionMoney) => repetitionMoney.transfer_id === id
                  ).length > 0
                    ? "ml-48"
                    : "ml-60"
                }
              >
                保存
              </Button>
              <IconButton
                onClick={() => handleTransferDelete(id)}
                className="ml-auto"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </li>
        </ul>
        {editRepetition === true &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.transfer_id === id
          ).length > 0 && (
            <div className="w-full pt-10">
              <Typography variant="subtitle1">繰り返し一覧</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 635 }}>
                <Table stickyHeader size="small" aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>金額</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRows.map((repetitionMoney) => (
                      <RepetitionMoneyRow
                        key={repetitionMoney.id}
                        id={repetitionMoney.id}
                        amount={repetitionMoney.amount}
                        repetition_schedule={
                          repetitionMoney.repetition_schedule
                        }
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
      </Stack>
    </Box>
  );
};
