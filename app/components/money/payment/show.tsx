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
import { paymentEdit, paymentDelete } from "@/lib/api/payment-api";
import { classificationMonthlyAmountEdit } from "@/lib/api/classificationMonthlyAmount-api";

import { paymentShowProps } from "@/interface/payment-interface";
import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";
import { classificationMonthlyAmountData } from "@/interface/classification-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";
import { RepetitionMoneyRow } from "@/components/money/repetitionMoney/row";

export const PaymentShow: React.FC<paymentShowProps> = (props) => {
  const {
    id,
    category_id,
    classification_id,
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
    repetitionMoneies,
    classifications,
    categories,
    classificationMonthlyAmounts,
    currentMonth,
    setIsEditing,
    loading,
    setLoading,
  } = useContext(moneyContext);
  const initialDateObject = new Date().toLocaleDateString().split("T")[0];
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 5);
  const endDateObject = currentDate.toLocaleDateString();
  const startCurrentMonth = new Date(
    Number(currentMonth.slice(0, 4)),
    Number(currentMonth.slice(4)) - 1,
    1
  );
  const endCurrentMonth = new Date(
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

  const initialClassificationId = classification_id;
  const initialAmount = amount;
  const initialSchedule = schedule;
  const initialEndDate = end_date;
  const initialMonth = `${new Date(schedule).getFullYear()}${
    new Date(schedule).getMonth() + 1
  }`;
  const initialRepetition = repetition;
  const intialRepetitionType = repetition_type;
  const intialRepetitionSettings = repetition_settings;

  const [editCategoryId, setEditCategoryId] = useState(category_id);
  const [editClassificationId, setEditClassificationId] =
    useState(classification_id);
  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState(schedule);
  const [editMonth, setEditMonth] = useState(
    `${new Date(schedule).getFullYear()}${new Date(schedule).getMonth() + 1}`
  );
  const [editEndDate, setEditEndDate] = useState(end_date);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState<string[]>(repetition_settings);
  const [editBody, setEditBody] = useState(body);
  const [isClassificationFormValid, setIsClassificationFormValid] = useState(
    editClassificationId ? false : true
  );
  const [isCategoryFormValid, setIsCategoryFormValid] = useState(
    editCategoryId ? false : true
  );
  const [sortRepetitionMoney, setSortRepetitionMoney] =
    useState<boolean>(false);

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true); 
    }
  }, [editAmount]);

  useEffect(() => {
    if (editRepetitionAmount > 0) {
      setEditRepetitionAmountError(false);
    } else {
      setEditRepetitionAmountError(true);
    }
  }, [editRepetitionAmount]);

  const editPayment = async (id: string) => {
    setLoading(true);
    const initialClassificationMonthlyAmount: classificationMonthlyAmountData =
      classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id ===
            initialClassificationId &&
          classificationMonthlyAmount.month === initialMonth
      )[0];
    const editClassificationMonthlyAmount: classificationMonthlyAmountData =
      classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id ===
            editClassificationId &&
          classificationMonthlyAmount.month === editMonth
      )[0];

    const initialRepetitionDelete = async () =>
      await Promise.all(
        repetitionMoneies
          .filter((repetitionMoney) => repetitionMoney.payment_id === id)
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
            "payment",
            id,
            "",
            "",
            editAmount,
            stringDate
          );
          repetitionMoneyDate = [...repetitionMoneyDate, repetitionMoney];
        })
      );
    };

    const startDate = (date: string) =>
      new Date(Number(date.slice(0, 4)), Number(date.slice(4)) - 1, 1);
    const endDate = (date: string) =>
      new Date(Number(date.slice(0, 4)), Number(date.slice(4)), 0, 23, 59);

    const initialRepetitionMoneyReduce = async (start: Date, end: Date) => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneies.filter(
        (repetitionMoney) =>
          repetitionMoney.transaction_type === "payment" &&
          repetitionMoney.payment_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() >=
            start.getTime() &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            end.getTime()
      )) {
        money += parseFloat(String(repetitionMoney.amount));
      }
      return money;
    };

    const editRepetitionMoneyIncrease = async (start: Date, end: Date) => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneyDate.filter(
        (repetitionMoney) =>
          new Date(repetitionMoney.repetition_schedule).getTime() >=
            start.getTime() &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            end.getTime()
      )) {
        money += parseFloat(String(repetitionMoney.amount));
      }
      return money;
    };

    const editChangeRepetitionMoneyIncrease = async (
      start: Date,
      end: Date
    ) => {
      let money = 0;
      for (const repetitionMoney of repetitionMoneies.filter(
        (repetitionMoney) =>
          repetitionMoney.transaction_type === "payment" &&
          repetitionMoney.payment_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() >=
            start.getTime() &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            end.getTime()
      )) {
        let changeFound = false;
        for (let i = 0; i < changeRepetitionMoneyData.length; i += 3) {
          if (repetitionMoney.id === changeRepetitionMoneyData[i]) {
            if (
              (new Date(changeRepetitionMoneyData[i + 2]).getTime() >=
                start.getTime() &&
                new Date(changeRepetitionMoneyData[i + 2]).getTime() <=
                  end.getTime()) ||
              changeRepetitionMoneyData[i + 2] === ""
            ) {
              money +=
                Number(changeRepetitionMoneyData[i + 1]) != 0
                  ? parseFloat(String(changeRepetitionMoneyData[i + 1]))
                  : parseFloat(String(repetitionMoney.amount));
            }
            changeFound = true;
            break;
          }
        }
        if (changeFound === false) {
          money += parseFloat(String(repetitionMoney.amount));
        }
      }
      for (const repetitionMoney of repetitionMoneies.filter(
        (repetitionMoney) =>
          repetitionMoney.transaction_type === "payment" &&
          repetitionMoney.payment_id === id &&
          (new Date(repetitionMoney.repetition_schedule).getTime() <
            start.getTime() ||
            new Date(repetitionMoney.repetition_schedule).getTime() >
              end.getTime())
      )) {
        for (let i = 0; i < changeRepetitionMoneyData.length; i += 3) {
          if (repetitionMoney.id === changeRepetitionMoneyData[i]) {
            if (
              (new Date(changeRepetitionMoneyData[i + 2]).getTime() >=
                start.getTime() &&
                new Date(changeRepetitionMoneyData[i + 2]).getTime() <=
                  end.getTime()) ||
              changeRepetitionMoneyData[i + 2] === ""
            ) {
              money +=
                Number(changeRepetitionMoneyData[i + 1]) != 0
                  ? parseFloat(String(changeRepetitionMoneyData[i + 1]))
                  : parseFloat(String(repetitionMoney.amount));
            }
            break;
          }
        }
      }
      return money;
    };

    try {
      await paymentEdit(
        id,
        editCategoryId,
        editClassificationId,
        editAmount,
        editSchedule,
        editEndDate,
        editRepetition,
        editRepetitionType,
        editRepetitionSettings,
        editBody
      );

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
      }

      if (
        editRepetition === true &&
        initialRepetition === editRepetition &&
        intialRepetitionType === editRepetitionType &&
        JSON.stringify(intialRepetitionSettings) ===
          JSON.stringify(editRepetitionSettings) &&
        initialSchedule === editSchedule &&
        initialEndDate === editEndDate
      ) {
        if (initialClassificationId === editClassificationId) {
          for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
              initialClassificationId
          )) {
            let money = 0;
            const start = startDate(classificationMonthlyAmount.month);
            const end = endDate(classificationMonthlyAmount.month);

            money =
              parseFloat(String(classificationMonthlyAmount.amount)) -
              (await initialRepetitionMoneyReduce(start, end)) +
              (await editChangeRepetitionMoneyIncrease(start, end));

            await classificationMonthlyAmountEdit(
              classificationMonthlyAmount.id,
              classificationMonthlyAmount.classification_id,
              classificationMonthlyAmount.month,
              classificationMonthlyAmount.date,
              Math.max(0, money)
            );
          }
        } else {
          if (initialClassificationId !== null) {
            for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                initialClassificationId
            )) {
              let money = 0;
              const start = startDate(classificationMonthlyAmount.month);
              const end = endDate(classificationMonthlyAmount.month);

              money =
                parseFloat(String(classificationMonthlyAmount.amount)) -
                (await initialRepetitionMoneyReduce(start, end));

              await classificationMonthlyAmountEdit(
                classificationMonthlyAmount.id,
                classificationMonthlyAmount.classification_id,
                classificationMonthlyAmount.month,
                classificationMonthlyAmount.date,
                Math.max(0, money)
              );
            }
          }
          for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
              editClassificationId
          )) {
            let money = 0;
            const start = startDate(classificationMonthlyAmount.month);
            const end = endDate(classificationMonthlyAmount.month);

            money =
              parseFloat(String(classificationMonthlyAmount.amount)) +
              (await editChangeRepetitionMoneyIncrease(start, end));

            await classificationMonthlyAmountEdit(
              classificationMonthlyAmount.id,
              classificationMonthlyAmount.classification_id,
              classificationMonthlyAmount.month,
              classificationMonthlyAmount.date,
              Math.max(0, money)
            );
          }
        }
      } else {
        if (initialClassificationId === editClassificationId) {
          if (editRepetition === true) {
            if (initialRepetition === true) {
              await initialRepetitionDelete();
              await editRepetitionAdd();

              for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                  initialClassificationId
              )) {
                let money = 0;
                const start = startDate(classificationMonthlyAmount.month);
                const end = endDate(classificationMonthlyAmount.month);

                money =
                  parseFloat(String(classificationMonthlyAmount.amount)) -
                  (await initialRepetitionMoneyReduce(start, end)) +
                  (await editRepetitionMoneyIncrease(start, end));

                await classificationMonthlyAmountEdit(
                  classificationMonthlyAmount.id,
                  classificationMonthlyAmount.classification_id,
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date,
                  Math.max(0, money)
                );
              }
            } else {
              await editRepetitionAdd();

              for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                  initialClassificationId
              )) {
                let money = 0;
                const start = startDate(classificationMonthlyAmount.month);
                const end = endDate(classificationMonthlyAmount.month);

                money =
                  parseFloat(String(classificationMonthlyAmount.amount)) +
                  (await editRepetitionMoneyIncrease(start, end));

                if (
                  classificationMonthlyAmount.id ===
                  initialClassificationMonthlyAmount.id
                ) {
                  money = money - parseFloat(String(initialAmount));
                  await classificationMonthlyAmountEdit(
                    classificationMonthlyAmount.id,
                    classificationMonthlyAmount.classification_id,
                    classificationMonthlyAmount.month,
                    classificationMonthlyAmount.date,
                    Math.max(0, money)
                  );
                } else {
                  await classificationMonthlyAmountEdit(
                    classificationMonthlyAmount.id,
                    classificationMonthlyAmount.classification_id,
                    classificationMonthlyAmount.month,
                    classificationMonthlyAmount.date,
                    Math.max(0, money)
                  );
                }
              }
            }
          } else {
            if (initialRepetition === true) {
              await initialRepetitionDelete();

              for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                  initialClassificationId
              )) {
                let money = 0;
                const start = startDate(classificationMonthlyAmount.month);
                const end = endDate(classificationMonthlyAmount.month);

                money =
                  parseFloat(String(classificationMonthlyAmount.amount)) -
                  (await initialRepetitionMoneyReduce(start, end));

                if (
                  classificationMonthlyAmount.id ===
                  editClassificationMonthlyAmount.id
                ) {
                  money = money + parseFloat(String(editAmount));
                  await classificationMonthlyAmountEdit(
                    classificationMonthlyAmount.id,
                    classificationMonthlyAmount.classification_id,
                    classificationMonthlyAmount.month,
                    classificationMonthlyAmount.date,
                    Math.max(0, money)
                  );
                } else {
                  await classificationMonthlyAmountEdit(
                    classificationMonthlyAmount.id,
                    classificationMonthlyAmount.classification_id,
                    classificationMonthlyAmount.month,
                    classificationMonthlyAmount.date,
                    Math.max(0, money)
                  );
                }
              }
            } else {
              if (
                initialClassificationMonthlyAmount.id ===
                editClassificationMonthlyAmount.id
              ) {
                const editMoney =
                  parseFloat(
                    String(initialClassificationMonthlyAmount.amount)
                  ) -
                  parseFloat(String(initialAmount)) +
                  parseFloat(String(editAmount));

                await classificationMonthlyAmountEdit(
                  initialClassificationMonthlyAmount.id,
                  initialClassificationMonthlyAmount.classification_id,
                  initialClassificationMonthlyAmount.month,
                  initialClassificationMonthlyAmount.date,
                  Math.max(0, editMoney)
                );
              } else {
                const initialMoney =
                  parseFloat(
                    String(initialClassificationMonthlyAmount.amount)
                  ) - parseFloat(String(initialAmount));

                await classificationMonthlyAmountEdit(
                  initialClassificationMonthlyAmount.id,
                  initialClassificationMonthlyAmount.classification_id,
                  initialClassificationMonthlyAmount.month,
                  initialClassificationMonthlyAmount.date,
                  Math.max(0, initialMoney)
                );
                if (editClassificationMonthlyAmount) {
                  const editMoney =
                    parseFloat(String(editClassificationMonthlyAmount.amount)) +
                    parseFloat(String(editAmount));

                  await classificationMonthlyAmountEdit(
                    editClassificationMonthlyAmount.id,
                    editClassificationMonthlyAmount.classification_id,
                    editClassificationMonthlyAmount.month,
                    editClassificationMonthlyAmount.date,
                    Math.max(0, editMoney)
                  );
                }
              }
            }
          }
        } else {
          if (initialClassificationId !== null) {
            if (initialRepetition === true) {
              await initialRepetitionDelete();

              for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                  initialClassificationId
              )) {
                let money = 0;
                const start = startDate(classificationMonthlyAmount.month);
                const end = endDate(classificationMonthlyAmount.month);

                money =
                  parseFloat(String(classificationMonthlyAmount.amount)) -
                  (await initialRepetitionMoneyReduce(start, end));

                await classificationMonthlyAmountEdit(
                  classificationMonthlyAmount.id,
                  classificationMonthlyAmount.classification_id,
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date,
                  Math.max(0, money)
                );
              }
            } else {
              const initialClassificationAmount =
                parseFloat(String(initialClassificationMonthlyAmount.amount)) -
                parseFloat(String(initialAmount));

              await classificationMonthlyAmountEdit(
                initialClassificationMonthlyAmount.id,
                initialClassificationMonthlyAmount.classification_id,
                initialClassificationMonthlyAmount.month,
                initialClassificationMonthlyAmount.date,
                Math.max(0, initialClassificationAmount)
              );
            }
          }

          if (editRepetition === true) {
            await editRepetitionAdd();

            for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                editClassificationId
            )) {
              let money = 0;
              const start = startDate(classificationMonthlyAmount.month);
              const end = endDate(classificationMonthlyAmount.month);

              money =
                parseFloat(String(classificationMonthlyAmount.amount)) +
                (await editRepetitionMoneyIncrease(start, end));

              await classificationMonthlyAmountEdit(
                classificationMonthlyAmount.id,
                classificationMonthlyAmount.classification_id,
                classificationMonthlyAmount.month,
                classificationMonthlyAmount.date,
                Math.max(0, money)
              );
            }
          } else {
            if (editClassificationMonthlyAmount) {
              const editClassificationAmount =
                parseFloat(String(editClassificationMonthlyAmount.amount)) +
                parseFloat(String(editAmount));

              await classificationMonthlyAmountEdit(
                editClassificationMonthlyAmount.id,
                editClassificationMonthlyAmount.classification_id,
                editClassificationMonthlyAmount.month,
                editClassificationMonthlyAmount.date,
                Math.max(0, editClassificationAmount)
              );
            }
          }
        }
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDelete = async (id: string) => {
    setLoading(true);
    try {
      if (initialClassificationId === null) {
        paymentDelete(id);
      } else {
        if (initialRepetition === true) {
          for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
              initialClassificationId
          )) {
            let money = parseFloat(String(classificationMonthlyAmount.amount));
            const start = new Date(
              Number(classificationMonthlyAmount.month.slice(0, 4)),
              Number(classificationMonthlyAmount.month.slice(4)) - 1,
              1
            );
            const end = new Date(
              Number(classificationMonthlyAmount.month.slice(0, 4)),
              Number(classificationMonthlyAmount.month.slice(4)),
              0,
              23,
              59
            );

            for (const repetitionMoney of repetitionMoneies.filter(
              (repetitionMoney) =>
                repetitionMoney.transaction_type === "payment" &&
                repetitionMoney.payment_id === id &&
                new Date(repetitionMoney.repetition_schedule).getTime() >=
                  start.getTime() &&
                new Date(repetitionMoney.repetition_schedule).getTime() <=
                  end.getTime()
            )) {
              money -= parseFloat(String(repetitionMoney.amount));
            }

            await classificationMonthlyAmountEdit(
              classificationMonthlyAmount.id,
              classificationMonthlyAmount.classification_id,
              classificationMonthlyAmount.month,
              classificationMonthlyAmount.date,
              money
            );
          }
        } else {
          const editClassificationMonthlyAmount: classificationMonthlyAmountData =
            classificationMonthlyAmounts.filter(
              (classificationMonthlyAmount) =>
                classificationMonthlyAmount.classification_id ===
                  initialClassificationId &&
                classificationMonthlyAmount.month === initialMonth
            )[0];

          if (editClassificationMonthlyAmount) {
            const editClassificationAmount =
              parseFloat(String(editClassificationMonthlyAmount.amount)) -
              parseFloat(String(initialAmount));

            await classificationMonthlyAmountEdit(
              editClassificationMonthlyAmount.id,
              editClassificationMonthlyAmount.classification_id,
              editClassificationMonthlyAmount.month,
              editClassificationMonthlyAmount.date,
              Math.max(0, editClassificationAmount)
            );
          }
        }
        paymentDelete(id);
      }
      setIsEditing(true);
      onClose();
    } catch (error) {
      console.error("Failed to edit payment:", error);
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
    const selectedRepetitionMoney = repetitionMoneies.filter(
      (repetitionMoney) => repetitionMoney.id === id
    )[0];

    try {
      for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id ===
          initialClassificationId
      )) {
        let money = parseFloat(String(classificationMonthlyAmount.amount));
        const start = new Date(
          Number(classificationMonthlyAmount.month.slice(0, 4)),
          Number(classificationMonthlyAmount.month.slice(4)) - 1,
          1
        );
        const end = new Date(
          Number(classificationMonthlyAmount.month.slice(0, 4)),
          Number(classificationMonthlyAmount.month.slice(4)),
          0,
          23,
          59
        );

        if (
          new Date(selectedRepetitionMoney.repetition_schedule).getTime() >=
            start.getTime() &&
          new Date(selectedRepetitionMoney.repetition_schedule).getTime() <=
            end.getTime()
        ) {
          money = money - parseFloat(String(selectedRepetitionMoney.amount));

          await classificationMonthlyAmountEdit(
            classificationMonthlyAmount.id,
            classificationMonthlyAmount.classification_id,
            classificationMonthlyAmount.month,
            classificationMonthlyAmount.date,
            money
          );
        }
      }

      repetitionMoneyDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete repetitionPayment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassificationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditClassificationId(value);
    setIsClassificationFormValid(false);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEditCategoryId(value);
    const selectedCategory = categories.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setIsCategoryFormValid(false);
    }
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
    setLoading(true);
    setRepetitionNewDialogOpen(false);
    try {
      const response = await repetitionMoneyNew(
        "payment",
        id,
        "",
        "",
        editRepetitionAmount,
        editRepetitionSchedule
      );
      for (const classificationMonthlyAmount of classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id ===
          initialClassificationId
      )) {
        let money = parseFloat(String(classificationMonthlyAmount.amount));
        const start = new Date(
          Number(classificationMonthlyAmount.month.slice(0, 4)),
          Number(classificationMonthlyAmount.month.slice(4)) - 1,
          1
        );
        const end = new Date(
          Number(classificationMonthlyAmount.month.slice(0, 4)),
          Number(classificationMonthlyAmount.month.slice(4)),
          0,
          23,
          59
        );

        if (
          new Date(response.repetition_schedule).getTime() >= start.getTime() &&
          new Date(response.repetition_schedule).getTime() <= end.getTime()
        ) {
          money = money + parseFloat(String(response.amount));

          await classificationMonthlyAmountEdit(
            classificationMonthlyAmount.id,
            classificationMonthlyAmount.classification_id,
            classificationMonthlyAmount.month,
            classificationMonthlyAmount.date,
            money
          );
        }
      }

      setIsEditing(true);
    } catch (error) {
      console.error("Failed to add repetitionPayment:", error);
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
    const StringMonth = `${date.getFullYear()}${date.getMonth() + 1}`;
    setEditSchedule(stringDate);
    setEditMonth(StringMonth);
  };

  const handleEndDateChange = (date: Date) => {
    let stringDate: string;
    if (date.getTime() <= new Date(editSchedule).getTime()) {
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
      editPayment(id);
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
    .filter((repetitionMoney) => repetitionMoney.payment_id === id)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.repetition_schedule).getTime();
      const dateB = new Date(b.repetition_schedule).getTime();
      return dateA - dateB;
    });

  const sortedCurrentMonthRows = repetitionMoneies
    .filter(
      (repetitionMoney) =>
        repetitionMoney.payment_id === id &&
        new Date(repetitionMoney.repetition_schedule).getTime() >=
          startCurrentMonth.getTime() &&
        new Date(repetitionMoney.repetition_schedule).getTime() <=
          endCurrentMonth.getTime()
    )
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.repetition_schedule).getTime();
      const dateB = new Date(b.repetition_schedule).getTime();
      return dateA - dateB;
    });

  const sortedClassifications = classifications
    .filter(
      (classification) => classification.classification_type === "payment"
    )
    .slice()
    .sort((a, b) => {
      if (a.id === editClassificationId) {
        return -1;
      } else if (b.id === editClassificationId) {
        return 1;
      }
      return a.id > b.id ? 1 : -1;
    });

  const sortedCategories = categories
    .filter((category) => category.category_type === "payment")
    .slice()
    .sort((a, b) => {
      if (a.id === editCategoryId) {
        return -1;
      } else if (b.id === editCategoryId) {
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
            (repetitionMoney) => repetitionMoney.payment_id === id
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }} className="mb-16">
          <Button
            onClick={handleNewRepetitionMoneySave}
            sx={{ minWidth: 120, bgcolor: "#4caf50", color: "#fff" }}
            disabled={editRepetitionAmountError}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={5}>
        <ul className="w-full">
          <li className="pt-10">
            <Typography variant="subtitle1">分類</Typography>
            <Select
              fullWidth
              value={editClassificationId}
              onChange={handleClassificationChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {sortedClassifications.map((classification) => (
                <MenuItem key={classification.id} value={classification.id}>
                  {classification.name}
                </MenuItem>
              ))}
            </Select>
            {isClassificationFormValid && (
              <Typography align="left" variant="subtitle1">
                分類を選択してください
              </Typography>
            )}
          </li>
          <li className="pt-5">
            <Typography variant="subtitle1">カテゴリ</Typography>
            <Select
              fullWidth
              value={editCategoryId}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {sortedCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {isCategoryFormValid && (
              <Typography align="left" variant="subtitle1">
                カテゴリを選択してください
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
                {editAmountError && (
                  <Typography align="left" variant="subtitle1">
                    金額を0より上にして下さい
                  </Typography>
                )}
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
                      isClassificationFormValid ||
                      isCategoryFormValid ||
                      (editAmountError &&
                        !(
                          editRepetition === true &&
                          intialRepetitionType === editRepetitionType &&
                          JSON.stringify(intialRepetitionSettings) ===
                            JSON.stringify(editRepetitionSettings) &&
                          initialSchedule === editSchedule &&
                          initialEndDate === editEndDate
                        ))
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
                        (repetitionMoney) => repetitionMoney.payment_id === id
                      ).length > 0
                        ? "ml-48"
                        : "ml-60"
                    }
                  >
                    保存
                  </Button>
                  <IconButton
                    onClick={() => handlePaymentDelete(id)}
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
            (repetitionMoney) => repetitionMoney.payment_id === id
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
                <Table
                  stickyHeader
                  size="small"
                  aria-label="sticky table"
                  sx={{
                    "& > *": {
                      borderBottom: "unset",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
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
                            limitAmount={-1}
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
                            limitAmount={-1}
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
