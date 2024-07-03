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
  const [editAccountMonthlyDate, setEditAccountMonthlyDate] = useState<boolean>(
    classificationMonthlyAmount.date === "100" ? true : false
  );
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

    if (!editAccountMonthlyDate) {
      if (
        Number(currentMonth.slice(4)) === 12 ||
        Number(currentMonth.slice(4)) === 2 ||
        Number(currentMonth.slice(4)) === 4 ||
        Number(currentMonth.slice(4)) === 6 ||
        Number(currentMonth.slice(4)) === 7 ||
        Number(currentMonth.slice(4)) === 9 ||
        Number(currentMonth.slice(4)) === 11
      ) {
        if (editMonthlyDateNumber >= 32) {
          setEditMonthlyDateError(true);
        }
      } else if (
        Number(currentMonth.slice(4)) === 3 ||
        Number(currentMonth.slice(4)) === 5 ||
        Number(currentMonth.slice(4)) === 8 ||
        Number(currentMonth.slice(4)) === 10
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
    }
  }, [editMonthlyDateNumber, editAccountId]);

  const editClassification = async (id: string) => {
    setLoading(true);
    const selectedClassificationMonthlyAmounts: classificationMonthlyAmountData[] =
      classificationMonthlyAmounts.filter(
        (classificationMonthlyAmount) =>
          classificationMonthlyAmount.classification_id === id
      );

    // let hundredCounts: boolean = false;
    // selectedClassificationMonthlyAmounts.forEach(
    //   (classificationMonthlyAmount) => {
    //     const date = classificationMonthlyAmount.date;
    //     if (date === "100") {
    //       hundredCounts = true;
    //     }
    //   }
    // );

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
        for (
          let i = 0;
          i < selectedClassificationMonthlyAmounts.length;
          i += 1
        ) {
          if (
            selectedClassificationMonthlyAmounts[i].month ===
            classificationMonthlyAmount.month
          ) {
            if (editMonthlyDateNumber === 100) {
              await classificationMonthlyAmountEdit(
                classificationMonthlyAmount.id,
                classificationMonthlyAmount.classification_id,
                classificationMonthlyAmount.month,
                "100",
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
          } else {
            if (selectedClassificationMonthlyAmounts[i].date === "-1") {
              if (editMonthlyDateNumber === 100) {
                await classificationMonthlyAmountEdit(
                  selectedClassificationMonthlyAmounts[i].id,
                  selectedClassificationMonthlyAmounts[i].classification_id,
                  selectedClassificationMonthlyAmounts[i].month,
                  "100",
                  selectedClassificationMonthlyAmounts[i].amount
                );
              } else {
                await classificationMonthlyAmountEdit(
                  selectedClassificationMonthlyAmounts[i].id,
                  selectedClassificationMonthlyAmounts[i].classification_id,
                  selectedClassificationMonthlyAmounts[i].month,
                  editMonthlyDate,
                  selectedClassificationMonthlyAmounts[i].amount
                );
              }
            }
          }
        }
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

  const handleCheckboxChange = () => {
    setEditAccountMonthlyDate(!editAccountMonthlyDate);
    if (editAccountMonthlyDate) {
      setEditMonthlyDate("1");
      setEditMonthlyDateNumber(1);
    } else {
      setEditMonthlyDate("100");
      setEditMonthlyDateNumber(100);
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
        {classification_type === "payment" && editAccountId && (
          <li className="pt-10">
            <Typography variant="subtitle1">翌月支払い日</Typography>
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
                disabled={editAccountMonthlyDate}
              />
              <span>日</span>
            </div>{" "}
            <div className="flex items-center">
              <Checkbox
                checked={editAccountMonthlyDate}
                onChange={handleCheckboxChange}
              />
              即時反映
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
              className="ml-60"
            >
              保存
            </Button>
            <IconButton onClick={() => onDelete(id)} className="ml-auto">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </li>
      </ul>
    </Box>
  );
};
