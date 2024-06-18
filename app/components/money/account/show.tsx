"use client";
import React, { useState, useEffect, useContext, ChangeEvent } from "react";

import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { moneyContext } from "@/context/money-context";

import { accountEdit } from "@/lib/api/account-api";
import { accountShowProps } from "@/interface/account-interface";

export const AccountShow: React.FC<accountShowProps> = (props) => {
  const { id, name, amount, body, onClose, onDelete } = props;
  const { accounts, setIsEditing, setLoading } = useContext(moneyContext);

  const [editName, setEditName] = useState<string>(name);
  const [editNameError, setEditNameError] = useState<boolean>(false);
  const [editAmount, setEditAmount] = useState<number>(amount);
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editBody, setEditBody] = useState<string>(body);
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const account = accounts.filter((account) => account.name === editName)[0];
    if (account != undefined) {
      if (account.id != id) {
        setEditNameError(true);
      }
    } else {
      setEditNameError(false);
    }
  }, [editName]);

  useEffect(() => {
    if (editAmount >= 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }
  }, [editAmount]);

  const editAccount = async (id: string) => {
    setLoading(true);
    try {
      await accountEdit(id, editName, editAmount, editBody);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setEditName(value);
        setIsFormValid(value.trim().length > 0);
        break;
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

  const handleSave = () => {
    editAccount(id);
    onClose();
  };

  return (
    <Box width={560} height={500}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">名称</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
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
          <Typography variant="subtitle1">残高</Typography>
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
          </div>{" "}
          <li>
            {editAmountError && (
              <Typography align="left" variant="subtitle1">
                残高を0以上にして下さい
              </Typography>
            )}
          </li>
        </li>
        <li className="pt-10">
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
              disabled={!isFormValid || editAmountError || editNameError}
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
