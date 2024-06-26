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
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import {
  repetitionMoneyNew,
  repetitionMoneyEdit,
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

  const {
    accounts,
    repetitionMoneies,
    currentMonth,
    setIsEditing,
    loading,
    setLoading,
  } = useContext(moneyContext);
  const initialDateObject = new Date().toLocaleDateString().split("T")[0];
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();
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
  const start = new Date(
    Number(currentMonth.slice(0, 4)),
    Number(currentMonth.slice(4)) - 1,
    1
  );
  const end = new Date(
    Number(currentMonth.slice(0, 4)),
    Number(currentMonth.slice(4)),
    0,
    23,
    59
  );

  const [repetitionNewDialogOpen, setRepetitionNewDialogOpen] =
    useState<boolean>(false);
  const [editRepetitionAmount, setEditRepetitionAmount] = useState<number>(0);
  const [editRepetitionAmountString, setEditRepetitionAmountString] = useState(
    String(Math.floor(editRepetitionAmount)).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    )
  );
  const [editRepetitionAmountError, setEditRepetitionAmountError] =
    useState<boolean>(false);
  const [editRepetitionAmountOverError, setEditRepetitionAmountOverError] =
    useState<boolean>(false);
  const [editRepetitionSchedule, setEditRepetitionSchedule] =
    useState(initialDateObject);

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

  const [changeRepetitionMoneyData, setChangeRepetitionMoneyData] = useState<
    string[]
  >([]);

  const initialAmount = amount;
  const initialBeforeAccountId = before_account_id;
  const initialBeforeAccountAmount = accounts.filter(
    (account) => account.id === before_account_id
  )[0].amount;
  const initialAfterAccountId = after_account_id;
  const initialSchedule = schedule;
  const initialEndDate = end_date;
  const initialRepetition = repetition;
  const intialRepetitionType = repetition_type;
  const intialRepetitionSettings = repetition_settings;
  const [initialRepetitionAllMoney, setInitialRepetitionAllMoney] =
    useState<number>(0);

  const initialBeforeAccount: accountData = accounts.filter(
    (account) => account.id === initialBeforeAccountId
  )[0];

  const initialAfterAccount: accountData = accounts.filter(
    (account) => account.id === initialAfterAccountId
  )[0];

  const [editBeforeAccountId, setEditBeforeAccountId] =
    useState(before_account_id);
  const [editBeforeAccountAmount, setEditBeforeAccountAmount] =
    useState<number>(
      accounts.filter((account) => account.id === before_account_id)[0].amount
    );
  const [editAfterAccountId, setEditAfterAccountId] =
    useState(after_account_id);
  const [editAmount, setEditAmount] = useState<number>(amount);
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
  const [editBeforeAccount, setEditBeforeAccount] =
    useState<accountData>(initialBeforeAccount);
  const [editAfterAccount, setEditAfterAccount] =
    useState<accountData>(initialAfterAccount);

  const [isBeforeTitleFormValid, setIsBeforeTitleFormValid] =
    useState<boolean>(false);
  const [isAfterTitleFormValid, setIsAfterTitleFormValid] =
    useState<boolean>(false);
  const [sortRepetitionMoney, setSortRepetitionMoney] =
    useState<boolean>(false);

  useEffect(() => {
    setEditBeforeAccount(
      accounts.filter((account) => account.id === editBeforeAccountId)[0]
    );
    setEditAfterAccount(
      accounts.filter((account) => account.id === editAfterAccountId)[0]
    );
  }, [accounts, editBeforeAccountId, editAfterAccountId]);

  useEffect(() => {
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

    const fetchInitialRepetitionAllMoney = async () => {
      const money = await initialRepetitionMoney();
      setInitialRepetitionAllMoney(money);
    };

    fetchInitialRepetitionAllMoney();
  }, [repetitionMoneies]);

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }

    if (
      !(
        intialRepetitionType === editRepetitionType &&
        JSON.stringify(intialRepetitionSettings) ===
          JSON.stringify(editRepetitionSettings) &&
        initialSchedule === editSchedule &&
        initialEndDate === editEndDate
      )
    ) {
      if (initialBeforeAccountId === editBeforeAccountId) {
        if (
          parseFloat(String(initialBeforeAccount.amount)) +
            parseFloat(String(initialRepetitionAllMoney)) >=
          parseFloat(String(editAmount))
        ) {
          setEditAmountOverError(false);
        } else {
          setEditAmountOverError(true);
        }
      } else {
        if (
          parseFloat(String(editBeforeAccountAmount)) >=
          parseFloat(String(editAmount))
        ) {
          setEditAmountOverError(false);
        } else {
          setEditAmountOverError(true);
        }
      }
    } else {
      if (initialBeforeAccountId === editBeforeAccountId) {
        if (
          parseFloat(String(editBeforeAccountAmount)) +
            parseFloat(String(initialAmount)) >=
          parseFloat(String(editAmount))
        ) {
          setEditAmountOverError(false);
        } else {
          setEditAmountOverError(true);
        }
      } else {
        if (
          parseFloat(String(editBeforeAccountAmount)) >=
          parseFloat(String(editAmount))
        ) {
          setEditAmountOverError(false);
        } else {
          setEditAmountOverError(true);
        }
      }
    }
  }, [editAmount, editBeforeAccountAmount, initialBeforeAccountAmount]);

  useEffect(() => {
    if (editRepetitionAmount > 0) {
      setEditRepetitionAmountError(false);
    } else {
      setEditRepetitionAmountError(true);
    }

    if (
      new Date(editRepetitionSchedule).getTime() <= endOfCurrentDay.getTime()
    ) {
      if (initialBeforeAccountId === editBeforeAccountId) {
        if (
          parseFloat(String(editBeforeAccountAmount)) >=
          parseFloat(String(editRepetitionAmount))
        ) {
          setEditRepetitionAmountOverError(false);
        } else {
          setEditRepetitionAmountOverError(true);
        }
      } else {
        if (
          parseFloat(String(editBeforeAccountAmount)) >=
          parseFloat(String(initialRepetitionAllMoney)) +
            parseFloat(String(editRepetitionAmount))
        ) {
          setEditRepetitionAmountOverError(false);
        } else {
          setEditRepetitionAmountOverError(true);
        }
      }
    }
  }, [
    editRepetitionAmount,
    editBeforeAccountAmount,
    initialBeforeAccountAmount,
  ]);

  const editTransfer = async (id: string) => {
    setLoading(true);
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
      if (
        editRepetition === true &&
        initialRepetition === editRepetition &&
        intialRepetitionType === editRepetitionType &&
        JSON.stringify(intialRepetitionSettings) ===
          JSON.stringify(editRepetitionSettings) &&
        initialSchedule === editSchedule &&
        initialEndDate === editEndDate
      ) {
        let changeMoney = 0;
        for (let i = 0; i < changeRepetitionMoneyData.length; i += 3) {
          const selectedRepetitionMoney = repetitionMoneies.filter(
            (repetitionMoney) =>
              repetitionMoney.id === changeRepetitionMoneyData[i]
          )[0];
          await repetitionMoneyEdit(
            changeRepetitionMoneyData[i],
            selectedRepetitionMoney.transaction_type,
            selectedRepetitionMoney.payment_id,
            selectedRepetitionMoney.income_id,
            selectedRepetitionMoney.transfer_id,
            Number(changeRepetitionMoneyData[i + 1]) != 0
              ? Number(changeRepetitionMoneyData[i + 1])
              : selectedRepetitionMoney.amount,
            changeRepetitionMoneyData[i + 2] != ""
              ? changeRepetitionMoneyData[i + 2]
              : selectedRepetitionMoney.repetition_schedule
          );

          if (
            new Date(selectedRepetitionMoney.repetition_schedule).getTime() <=
            endOfCurrentDay.getTime()
          ) {
            if (
              new Date(changeRepetitionMoneyData[i + 2]).getTime() <=
                endOfCurrentDay.getTime() ||
              changeRepetitionMoneyData[i + 2] === ""
            ) {
              changeMoney =
                changeMoney + Number(changeRepetitionMoneyData[i + 1]) != 0
                  ? parseFloat(String(changeRepetitionMoneyData[i + 1])) -
                    parseFloat(String(selectedRepetitionMoney.amount))
                  : 0;
            } else if (
              new Date(changeRepetitionMoneyData[i + 2]).getTime() >
              endOfCurrentDay.getTime()
            ) {
              changeMoney =
                changeMoney -
                parseFloat(String(selectedRepetitionMoney.amount));
            }
          } else {
            if (
              new Date(changeRepetitionMoneyData[i + 2]).getTime() <=
              endOfCurrentDay.getTime()
            ) {
              if (Number(changeRepetitionMoneyData[i + 1]) != 0) {
                changeMoney =
                  changeMoney +
                  parseFloat(String(changeRepetitionMoneyData[i + 1]));
              } else {
                changeMoney =
                  changeMoney +
                  parseFloat(String(selectedRepetitionMoney.amount));
              }
            }
          }
        }
        if (initialBeforeAccountId === editBeforeAccountId) {
          const money =
            parseFloat(String(initialBeforeAccount.amount)) - changeMoney;

          await accountEdit(
            initialBeforeAccount.id,
            initialBeforeAccount.name,
            Math.max(0, money),
            initialBeforeAccount.body
          );
        } else {
          const initialBeforeMoney =
            parseFloat(String(initialBeforeAccount.amount)) +
            parseFloat(String(initialRepetitionAllMoney));
          const editBeforeMoney =
            parseFloat(String(editBeforeAccount.amount)) -
            (changeMoney + parseFloat(String(initialRepetitionAllMoney)));

          await accountEdit(
            initialBeforeAccount.id,
            initialBeforeAccount.name,
            Math.max(0, initialBeforeMoney),
            initialBeforeAccount.body
          );

          await accountEdit(
            editBeforeAccount.id,
            editBeforeAccount.name,
            Math.max(0, editBeforeMoney),
            editBeforeAccount.body
          );
        }

        if (initialAfterAccountId === editAfterAccountId) {
          const money =
            parseFloat(String(initialAfterAccount.amount)) + changeMoney;

          await accountEdit(
            initialAfterAccount.id,
            initialAfterAccount.name,
            Math.max(0, money),
            initialAfterAccount.body
          );
        } else {
          const initialAfterMoney =
            parseFloat(String(initialAfterAccount.amount)) -
            parseFloat(String(initialRepetitionAllMoney));
          const editAfterMoney =
            parseFloat(String(editAfterAccount.amount)) +
            changeMoney +
            parseFloat(String(initialRepetitionAllMoney));

          await accountEdit(
            initialAfterAccount.id,
            initialAfterAccount.name,
            Math.max(0, initialAfterMoney),
            initialAfterAccount.body
          );

          await accountEdit(
            editAfterAccount.id,
            editAfterAccount.name,
            Math.max(0, editAfterMoney),
            editAfterAccount.body
          );
        }
      } else {
        if (initialBeforeAccountId === editBeforeAccountId) {
          let money = parseFloat(String(initialBeforeAccount.amount));
          if (editRepetition === true) {
            if (initialRepetition === true) {
              await initialRepetitionDelete();
              await editRepetitionAdd();

              money =
                money +
                parseFloat(String(initialRepetitionAllMoney)) -
                (await editRepetitionMoney());

              await accountEdit(
                initialBeforeAccount.id,
                initialBeforeAccount.name,
                Math.max(0, money),
                initialBeforeAccount.body
              );
            } else {
              await editRepetitionAdd();

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
              await initialRepetitionDelete();

              money =
                money +
                parseFloat(String(initialRepetitionAllMoney)) -
                editMoney;

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
            await initialRepetitionDelete();

            initialBeforeMoney =
              initialBeforeMoney +
              parseFloat(String(initialRepetitionAllMoney));

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
            await editRepetitionAdd();

            editBeforeMoney = editBeforeMoney - (await editRepetitionMoney());

            await accountEdit(
              editBeforeAccount.id,
              editBeforeAccount.name,
              Math.max(0, editBeforeMoney),
              editBeforeAccount.body
            );
          } else {
            editBeforeMoney = editBeforeMoney - editMoney;

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
              money =
                money -
                parseFloat(String(initialRepetitionAllMoney)) +
                (await editRepetitionMoney());

              await accountEdit(
                initialAfterAccount.id,
                initialAfterAccount.name,
                Math.max(0, money),
                initialAfterAccount.body
              );
            } else {
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
              money =
                money -
                parseFloat(String(initialRepetitionAllMoney)) +
                editMoney;

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
          let initialAfterMoney = parseFloat(
            String(initialAfterAccount.amount)
          );
          if (initialRepetition === true) {
            initialAfterMoney =
              initialAfterMoney - parseFloat(String(initialRepetitionAllMoney));

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
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferDelete = async (id: string) => {
    setLoading(true);
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
          initialBeforeMoney + parseFloat(String(initialRepetitionAllMoney));
        initialAfterMoney =
          initialAfterMoney - parseFloat(String(initialRepetitionAllMoney));

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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        if (!/^\d+$/.test(value)) {
          setEditAmountError(true);
        } else {
          setEditAmountError(false);
        }
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

  const handleRepetitionChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleRepetitionSchedulChange = (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditRepetitionSchedule(stringDate);
  };

  const deleteRepetition = async (id: string) => {
    setLoading(true);
    const initialBeforeAccount: accountData = accounts.filter(
      (account) => account.id === initialBeforeAccountId
    )[0];

    const initialAfterAccount: accountData = accounts.filter(
      (account) => account.id === initialAfterAccountId
    )[0];

    const selectedRepetitionMoney = repetitionMoneies.filter(
      (repetitionMoney) => repetitionMoney.id === id
    )[0];

    try {
      const initialBeforeMoney =
        parseFloat(String(initialBeforeAccount.amount)) +
        parseFloat(String(selectedRepetitionMoney.amount));
      const initialAfterMoney =
        parseFloat(String(initialAfterAccount.amount)) -
        parseFloat(String(selectedRepetitionMoney.amount));

      if (
        new Date(selectedRepetitionMoney.repetition_schedule).getTime() <=
        endOfCurrentDay.getTime()
      ) {
        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialBeforeMoney),
          initialBeforeAccount.body
        );

        await accountEdit(
          initialAfterAccount.id,
          initialAfterAccount.name,
          Math.max(0, initialAfterMoney),
          initialAfterAccount.body
        );
      }

      repetitionMoneyDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionPayment:", error);
    } finally {
      setLoading(false);
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

  const handleRepetitionMoneyChange = async (
    id: string,
    amount: number,
    date: string
  ) => {
    let idFound = false;
    setChangeRepetitionMoneyData((prevData) => {
      const newData = [...prevData];
      for (let i = 0; i < newData.length; i += 3) {
        if (newData[i] === id) {
          if (amount !== 0) {
            newData[i + 1] = String(amount);
          }
          if (date !== "") {
            newData[i + 2] = date;
          }
          idFound = true;
          break;
        }
      }
      if (!idFound) {
        newData.push(id, String(amount), date);
      }
      return newData;
    });
  };

  const handleNewRepetitionMoneyDialogOpen = () => {
    setRepetitionNewDialogOpen(true);
    const value = 0;
    setEditRepetitionAmountString(
      String(Math.floor(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
    setEditRepetitionAmount(value);
    setEditRepetitionSchedule(initialDateObject);
  };

  const handleNewRepetitionMoneyDialogCancel = () => {
    setRepetitionNewDialogOpen(false);
  };

  const handleNewRepetitionMoneySave = async () => {
    setRepetitionNewDialogOpen(false);
    try {
      setLoading(true);
      await repetitionMoneyNew(
        "transfer",
        "",
        "",
        id,
        editRepetitionAmount,
        editRepetitionSchedule
      );
      const initialBeforeMoney =
        parseFloat(String(initialBeforeAccount.amount)) -
        parseFloat(String(editRepetitionAmount));
      const initialAfterMoney =
        parseFloat(String(initialAfterAccount.amount)) +
        parseFloat(String(editRepetitionAmount));

      if (
        new Date(editRepetitionSchedule).getTime() <= endOfCurrentDay.getTime()
      ) {
        await accountEdit(
          initialBeforeAccount.id,
          initialBeforeAccount.name,
          Math.max(0, initialBeforeMoney),
          initialBeforeAccount.body
        );

        await accountEdit(
          initialAfterAccount.id,
          initialAfterAccount.name,
          Math.max(0, initialAfterMoney),
          initialAfterAccount.body
        );
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionPayment:", error);
    } finally {
      setLoading(false);
    }
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
    setEditSchedule(initialDateObject);
    setEditEndDate(endDateObject);
  };

  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(true);
    setEditRepetitionType(period);
    setEditRepetitionSettings([frequency.toString(), ...selectedDays]);
  };

  const handleSchedulChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      let previousDate = new Date(endDateObject);
      previousDate.setDate(previousDate.getDate() - 1);
      stringDate = previousDate.toLocaleDateString().split("T")[0];
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }

    setEditSchedule(stringDate);
  };

  const handleEndDateChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() >= new Date(endDateObject).getTime()) {
      stringDate = endDateObject;
    } else if (date.getTime() <= new Date(editSchedule).getTime()) {
      let nextDate = new Date(editSchedule);
      nextDate.setDate(nextDate.getDate() + 1);
      stringDate = nextDate.toLocaleDateString().split("T")[0];
    } else {
      stringDate = date.toLocaleDateString().split("T")[0];
    }

    setEditEndDate(stringDate);
  };

  const handleSave = () => {
    if (
      editAmount > 0 ||
      (editRepetition === true &&
        intialRepetitionType === editRepetitionType &&
        JSON.stringify(intialRepetitionSettings) ===
          JSON.stringify(editRepetitionSettings) &&
        initialSchedule === editSchedule &&
        initialEndDate === editEndDate)
    ) {
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

  const handleSortRepetitionMoney = () => {
    setSortRepetitionMoney(!sortRepetitionMoney);
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

  const sortedCurrentMonthRows = repetitionMoneies
    .filter(
      (repetitionMoney) =>
        repetitionMoney.transfer_id === id &&
        new Date(repetitionMoney.repetition_schedule).getTime() >=
          start.getTime() &&
        new Date(repetitionMoney.repetition_schedule).getTime() <= end.getTime()
    )
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.repetition_schedule).getTime();
      const dateB = new Date(b.repetition_schedule).getTime();
      return dateA - dateB;
    });

  const sortedBeforeAccounts = accounts
    .filter((account) => account.id !== editAfterAccountId)
    .slice()
    .sort((a, b) => {
      if (a.id === editBeforeAccountId) {
        return -1;
      } else if (b.id === editBeforeAccountId) {
        return 1;
      }
      return a.id > b.id ? 1 : -1;
    });

  const sortedAfterAccounts = accounts
    .filter((account) => account.id !== editBeforeAccountId)
    .slice()
    .sort((a, b) => {
      if (a.id === editAfterAccountId) {
        return -1;
      } else if (b.id === editAfterAccountId) {
        return 1;
      }
      return a.id > b.id ? 1 : -1;
    });

  return (
    <Box
      sx={{
        width:
          editRepetition === true &&
          intialRepetitionType === editRepetitionType &&
          JSON.stringify(intialRepetitionSettings) ===
            JSON.stringify(editRepetitionSettings) &&
          initialSchedule === editSchedule &&
          initialEndDate === editEndDate &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.transfer_id === id
          ).length > 0
            ? 1000
            : 560,
        height: 815,
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

      <Dialog
        open={repetitionNewDialogOpen}
        onClose={handleNewRepetitionMoneyDialogCancel}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "400px",
            height: "410px",
          },
        }}
      >
        <button
          onClick={handleNewRepetitionMoneyDialogCancel}
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </button>
        <DialogTitle sx={{ textAlign: "center" }}>新規作成</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <Typography variant="subtitle1">日付</Typography>
            <Box
              sx={{
                width: 98,
                border: "1px solid #ccc",
                borderRadius: "4px",
                borderWidth: "px",
              }}
            >
              <InputDateTime
                selectedDate={editRepetitionSchedule}
                onChange={handleRepetitionSchedulChange}
              />
            </Box>
            <Typography variant="subtitle1" className="pt-5">
              金額
            </Typography>
            <div className="flex items-center">
              <TextField
                variant="outlined"
                name="amount"
                value={editRepetitionAmountString}
                onChange={handleRepetitionChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />

              <span>円</span>
            </div>
            {editRepetitionAmountError && (
              <Typography align="left" variant="subtitle1">
                金額を0より上にして下さい
              </Typography>
            )}
            {editRepetitionAmountOverError && (
              <Typography align="left" variant="subtitle1">
                送金元名称に入っている残高以下にして下さい
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }} className="mb-16">
          <Button
            onClick={handleNewRepetitionMoneySave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={
              editRepetitionAmountError || editRepetitionAmountOverError
            }
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={5}>
        <ul className="w-full">
          <li className="pt-10">
            <Typography variant="subtitle1">送金元名称</Typography>
            <Select
              fullWidth
              value={editBeforeAccountId}
              onChange={handleBeforeAccountChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {sortedBeforeAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
            {initialBeforeAccountId === editBeforeAccountId &&
            !(
              intialRepetitionType === editRepetitionType &&
              JSON.stringify(intialRepetitionSettings) ===
                JSON.stringify(editRepetitionSettings) &&
              initialSchedule === editSchedule &&
              initialEndDate === editEndDate
            )
              ? accounts
                  .filter((account) => account.id === editBeforeAccountId)
                  .map((account) => (
                    <Typography
                      key={account.id}
                      align="left"
                      variant="subtitle1"
                    >
                      残高：
                      {formatAmountCommas(
                        parseFloat(String(initialBeforeAccount.amount)) +
                          parseFloat(String(initialRepetitionAllMoney))
                      )}
                    </Typography>
                  ))
              : accounts
                  .filter((account) => account.id === editBeforeAccountId)
                  .map((account) => (
                    <Typography
                      key={account.id}
                      align="left"
                      variant="subtitle1"
                    >
                      残高：{formatAmountCommas(account.amount)}
                    </Typography>
                  ))}
            {isBeforeTitleFormValid && (
              <Typography align="left" variant="subtitle1">
                送金元を選択してください
              </Typography>
            )}
            {editRepetition === true &&
            intialRepetitionType === editRepetitionType &&
            JSON.stringify(intialRepetitionSettings) ===
              JSON.stringify(editRepetitionSettings) &&
            initialSchedule === editSchedule &&
            initialEndDate === editEndDate &&
            initialBeforeAccountId != editBeforeAccountId
              ? initialRepetitionAllMoney >
                  accounts.filter(
                    (account) => account.id === editBeforeAccountId
                  )[0].amount && (
                  <Typography
                    align="left"
                    variant="subtitle1"
                    style={{ color: "red" }}
                  >
                    送金元の残高がマイナスになってしまいます
                  </Typography>
                )
              : false}
          </li>
          <li className="pt-5">
            <Typography variant="subtitle1">送金先名称</Typography>
            <Select
              fullWidth
              value={editAfterAccountId}
              onChange={handleAfterAccountChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {sortedAfterAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
            {accounts
              .filter((account) => account.id === editAfterAccountId)
              .map((account) => (
                <Typography key={account.id} align="left" variant="subtitle1">
                  残高：{formatAmountCommas(account.amount)}
                </Typography>
              ))}
            {isAfterTitleFormValid && (
              <Typography align="left" variant="subtitle1">
                送金先を選択してください
              </Typography>
            )}
          </li>
          {(initialRepetition === false ||
            editRepetition === false ||
            intialRepetitionType !== editRepetitionType ||
            JSON.stringify(intialRepetitionSettings) !==
              JSON.stringify(editRepetitionSettings) ||
            initialSchedule !== editSchedule ||
            initialEndDate !== editEndDate) && (
            <>
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
                    <Typography
                      align="left"
                      variant="subtitle1"
                      style={{ color: "red" }}
                    >
                      残高を0より上にしてください
                    </Typography>
                  )}
                  {editAmountOverError && (
                    <Typography
                      align="left"
                      variant="subtitle1"
                      style={{ color: "red" }}
                    >
                      送金元に入っている残高以下にして下さい
                    </Typography>
                  )}
                </Typography>
              </li>
            </>
          )}
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
                width: 98,
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
                  width: 98,
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
              {loading === true ? (
                <Typography variant="subtitle1">Loading...</Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={
                      loading ||
                      isBeforeTitleFormValid ||
                      isAfterTitleFormValid ||
                      ((editAmountError || editAmountOverError) &&
                        !(
                          editRepetition === true &&
                          intialRepetitionType === editRepetitionType &&
                          JSON.stringify(intialRepetitionSettings) ===
                            JSON.stringify(editRepetitionSettings) &&
                          initialSchedule === editSchedule &&
                          initialEndDate === editEndDate
                        )) ||
                      (editRepetition === true &&
                        intialRepetitionType === editRepetitionType &&
                        JSON.stringify(intialRepetitionSettings) ===
                          JSON.stringify(editRepetitionSettings) &&
                        initialSchedule === editSchedule &&
                        initialEndDate === editEndDate &&
                        initialBeforeAccountId != editBeforeAccountId)
                        ? initialRepetitionAllMoney >
                          accounts.filter(
                            (account) => account.id === editBeforeAccountId
                          )[0].amount
                        : false
                    }
                    color="primary"
                    className={
                      editRepetition === true &&
                      intialRepetitionType === editRepetitionType &&
                      JSON.stringify(intialRepetitionSettings) ===
                        JSON.stringify(editRepetitionSettings) &&
                      initialSchedule === editSchedule &&
                      initialEndDate === editEndDate &&
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
                </>
              )}
            </Stack>
          </li>
        </ul>
        {editRepetition === true &&
          intialRepetitionType === editRepetitionType &&
          JSON.stringify(intialRepetitionSettings) ===
            JSON.stringify(editRepetitionSettings) &&
          initialSchedule === editSchedule &&
          initialEndDate === editEndDate &&
          repetitionMoneies.filter(
            (repetitionMoney) => repetitionMoney.transfer_id === id
          ).length > 0 && (
            <div className="w-full pt-10">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" mr={2}>
                    繰り返し一覧
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={sortRepetitionMoney}
                      onChange={handleSortRepetitionMoney}
                    />
                    <Typography>カレンダーの表示月のみ</Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleNewRepetitionMoneyDialogOpen}>
                  <AddIcon />
                </IconButton>
              </Box>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 635, border: "0.5px solid black" }}
              >
                <Table stickyHeader size="small" aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>金額</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortRepetitionMoney === true
                      ? sortedCurrentMonthRows.map((repetitionMoney) => (
                          <RepetitionMoneyRow
                            key={repetitionMoney.id}
                            id={repetitionMoney.id}
                            amount={repetitionMoney.amount}
                            repetition_schedule={
                              repetitionMoney.repetition_schedule
                            }
                            limitAmount={
                              initialBeforeAccountId === editBeforeAccountId
                                ? parseFloat(
                                    String(initialBeforeAccount.amount)
                                  ) + parseFloat(String(repetitionMoney.amount))
                                : parseFloat(String(editBeforeAccount.amount))
                            }
                            onChange={handleRepetitionMoneyChange}
                            onDelete={deleteRepetition}
                          />
                        ))
                      : sortedRows.map((repetitionMoney) => (
                          <RepetitionMoneyRow
                            key={repetitionMoney.id}
                            id={repetitionMoney.id}
                            amount={repetitionMoney.amount}
                            repetition_schedule={
                              repetitionMoney.repetition_schedule
                            }
                            limitAmount={
                              initialBeforeAccountId === editBeforeAccountId
                                ? parseFloat(
                                    String(initialBeforeAccount.amount)
                                  ) + parseFloat(String(repetitionMoney.amount))
                                : parseFloat(String(editBeforeAccount.amount))
                            }
                            onChange={handleRepetitionMoneyChange}
                            onDelete={deleteRepetition}
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
