"use client";
import React, { useState, useContext, ChangeEvent } from "react";

import { Box, TextField, Button, Typography, Stack } from "@mui/material";

import { moneyContext } from "@/context/money-context";

import { accountNew } from "@/lib/api/account-api";
import { accountNewProps } from "@/interface/account-interface";

export const AccountNew: React.FC<accountNewProps> = (props) => {
  const { onClose } = props;
  const { setIsEditing } = useContext(moneyContext);

  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newAmountString, setNewAmountString] = useState("0");
  const [newBody, setNewBody] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const newAccount = async () => {
    try {
      await accountNew(newName, newAmount, newBody);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to create account:", error);
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
        setNewAmountString(
          value.startsWith("0") && value.length > 1
            ? value
                .replace(/^0+/, "")
                .replace(/,/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value === ""
            ? ""
            : value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setNewAmount(
          value === "" ? 0 : Math.floor(parseInt(value.replace(/,/g, ""), 10))
        );
        break;
      case "body":
        setNewBody(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    newAccount();
    onClose();
  };

  return (
    <Box width={560} height={450}>
      <ul className="w-full">
        <li className="pt-10">
          <Typography variant="subtitle1">口座名</Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            value={newName}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">金額</Typography>
          <div className="flex items-center">
            <TextField
              variant="outlined"
              name="amount"
              value={newAmountString}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <span>円</span>
          </div>
        </li>
        <li className="pt-10">
          <Typography variant="subtitle1">備考</Typography>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            name="body"
            value={newBody}
            onChange={handleChange}
          />
        </li>
        <li className="pt-10">
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid}
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
