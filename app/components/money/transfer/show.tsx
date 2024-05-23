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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { moneyContext } from "@/context/money-context";

import { transferEdit } from "@/lib/api/transfer-api";
import { accountEdit } from "@/lib/api/account-api";
import { transferShowProps } from "@/interface/account-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const TransferShow: React.FC<transferShowProps> = (props) => {
  const {
    id,
    before_account_id,
    after_account_id,
    after_account_name,
    amount,
    schedule,
    repetition,
    repetition_type,
    repetition_settings,
    body,
    onAccountUpdate,
    onTransferUpdate,
    onClose,
    onDelete,
  } = props;
  const { accounts } = useContext(moneyContext);

  const [repetitionDialogOpen, setRepetitionDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState(
    repetition_settings && repetition_settings[0] ? repetition_settings[0] : 1
  );
  const [selectedDays, setSelectedDays] = useState(
    repetition_settings && repetition_settings.length > 1
      ? repetition_settings.slice(1)
      : []
  );
  const [period, setPeriod] = useState(repetition_type ? repetition_type : "");

  const initialBeforeAccountId = before_account_id;
  const [initialBeforeAccountName, setInitialBeforeAccountName] = useState("");
  const [initialBeforeAccountAmount, setInitialBeforeAccountAmount] =
    useState(0);
  const [initialBeforeAccountBody, setInitialBeforeAccountBody] = useState("");
  const initialAfterAccountId = after_account_id;
  const initialAfterAccountName = after_account_name;
  const [initialAfterAccountAmount, setInitialAfterAccountAmount] = useState(0);
  const [initialAfterAccountBody, setInitialAfterAccountBody] = useState("");

  const [editBeforeAccountId, setEditBeforeAccountId] =
    useState(before_account_id);
  const [editBeforeAccountName, setEditBeforeAccountName] = useState("");
  const [editBeforeAccountAmount, setEditBeforeAccountAmount] = useState(0);
  const [editBeforeAccountBody, setEditBeforeAccountBody] = useState("");

  const [editAfterAccountId, setEditAfterAccountId] =
    useState(after_account_id);
  const [editAfterAccountName, setEditAfterAccountName] =
    useState(after_account_name);
  const [editAfterAccountAmount, setEditAfterAccountAmount] = useState(0);
  const [editAfterAccountBody, setEditAfterAccountBody] = useState("");

  const [editAmount, setEditAmount] = useState(amount);
  const initialAmount = amount;
  const [editAmountString, setEditAmountString] = useState<string>(
    String(Math.floor(editAmount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  const [editAmountError, setEditAmountError] = useState<boolean>(false);
  const [editAmountOverError, setEditAmountOverError] =
    useState<boolean>(false);
  const [editSchedule, setEditSchedule] = useState<Date>(schedule);
  const [editRepetition, setEditRepetition] = useState<boolean>(repetition);
  const [editRepetitionType, setEditRepetitionType] = useState(repetition_type);
  const [editRepetitionSettings, setEditRepetitionSettings] =
    useState(repetition_settings);
  const [editBody, setEditBody] = useState(body);

  useEffect(() => {
    const selectedBeforeAccount = accounts.find(
      (account) => account.id === initialBeforeAccountId
    );
    const selectedAfterAccount = accounts.find(
      (account) => account.id === initialAfterAccountId
    );
    if (selectedBeforeAccount && selectedAfterAccount) {
      setInitialBeforeAccountName(selectedBeforeAccount.name);
      setInitialBeforeAccountAmount(selectedBeforeAccount.amount);
      setInitialBeforeAccountBody(selectedBeforeAccount.body);

      setInitialAfterAccountAmount(selectedAfterAccount.amount);
      setInitialAfterAccountBody(selectedAfterAccount.body);

      console.log(typeof selectedBeforeAccount.amount);
      setEditBeforeAccountName(selectedBeforeAccount.name);
      setEditBeforeAccountAmount(selectedBeforeAccount.amount);
      setEditBeforeAccountBody(selectedBeforeAccount.body);

      setEditAfterAccountAmount(selectedAfterAccount.amount);
      setEditAfterAccountBody(selectedAfterAccount.body);
    }
  }, []);

  const editTransfer = async (id: string) => {
    try {
      if (!editAfterAccountName) {
        console.error("Name field is empty. Request not sent.");
        throw new Error("Name field cannot be empty.");
      } else {
        if (
          editBeforeAccountId === initialBeforeAccountId &&
          editAfterAccountId === initialAfterAccountId
        ) {
          const beforeAccountEditedAmount =
            parseFloat(String(editBeforeAccountAmount)) +
            parseFloat(String(initialAmount)) -
            parseFloat(String(editAmount));
          const afterAccountEditedAmount =
            parseFloat(String(editAfterAccountAmount)) -
            parseFloat(String(initialAmount)) +
            parseFloat(String(editAmount));

          await transferEdit(
            id,
            editBeforeAccountId,
            editAfterAccountId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );
          await accountEdit(
            editBeforeAccountId,
            editBeforeAccountName,
            beforeAccountEditedAmount,
            editBeforeAccountBody
          );
          await accountEdit(
            editAfterAccountId,
            editAfterAccountName,
            afterAccountEditedAmount,
            editAfterAccountBody
          );

          const editedTransfer = {
            id: id,
            before_account_id: editBeforeAccountId,
            after_account_id: editAfterAccountId,
            after_account_name: editAfterAccountName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const editedBeforeAccount = {
            id: editBeforeAccountId,
            name: editBeforeAccountName,
            amount: beforeAccountEditedAmount,
            body: editBeforeAccountBody,
          };
          const editedAfterAccount = {
            id: editAfterAccountId,
            name: editAfterAccountName,
            amount: afterAccountEditedAmount,
            body: editAfterAccountBody,
          };

          onAccountUpdate(editedBeforeAccount);
          onAccountUpdate(editedAfterAccount);
          onTransferUpdate(editedTransfer);
        } else if (
          editBeforeAccountId !== initialBeforeAccountId &&
          editAfterAccountId === initialAfterAccountId
        ) {
          const initialBeforeAccountEditedAmount =
            parseFloat(String(initialBeforeAccountAmount)) +
            parseFloat(String(initialAmount));
          const beforeAccountEditedAmount =
            parseFloat(String(editBeforeAccountAmount)) -
            parseFloat(String(editAmount));
          const afterAccountEditedAmount =
            parseFloat(String(editAfterAccountAmount)) -
            parseFloat(String(initialAmount)) +
            parseFloat(String(editAmount));

          await transferEdit(
            id,
            editBeforeAccountId,
            editAfterAccountId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );
          await accountEdit(
            initialBeforeAccountId,
            initialBeforeAccountName,
            initialBeforeAccountEditedAmount,
            initialBeforeAccountBody
          );
          await accountEdit(
            editBeforeAccountId,
            editBeforeAccountName,
            beforeAccountEditedAmount,
            editBeforeAccountBody
          );
          await accountEdit(
            editAfterAccountId,
            editAfterAccountName,
            afterAccountEditedAmount,
            editAfterAccountBody
          );

          const editedTransfer = {
            id: id,
            before_account_id: editBeforeAccountId,
            after_account_id: editAfterAccountId,
            after_account_name: editAfterAccountName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const editedInitialBeforeAccount = {
            id: initialBeforeAccountId,
            name: initialBeforeAccountName,
            amount: initialBeforeAccountEditedAmount,
            body: initialBeforeAccountBody,
          };
          const editedBeforeAccount = {
            id: editBeforeAccountId,
            name: editBeforeAccountName,
            amount: beforeAccountEditedAmount,
            body: editBeforeAccountBody,
          };
          const editedAfterAccount = {
            id: editAfterAccountId,
            name: editAfterAccountName,
            amount: afterAccountEditedAmount,
            body: editAfterAccountBody,
          };

          onAccountUpdate(editedInitialBeforeAccount);
          onAccountUpdate(editedBeforeAccount);
          onAccountUpdate(editedAfterAccount);
          onTransferUpdate(editedTransfer);
        } else if (
          editBeforeAccountId === initialBeforeAccountId &&
          editAfterAccountId !== initialAfterAccountId
        ) {
          const initialAfterAccountEditedAmount =
            parseFloat(String(initialAfterAccountAmount)) -
            parseFloat(String(initialAmount));
          const beforeAccountEditedAmount =
            parseFloat(String(editBeforeAccountAmount)) +
            parseFloat(String(initialAmount)) -
            parseFloat(String(editAmount));
          const afterAccountEditedAmount =
            parseFloat(String(editAfterAccountAmount)) +
            parseFloat(String(editAmount));

          await transferEdit(
            id,
            editBeforeAccountId,
            editAfterAccountId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );
          await accountEdit(
            initialAfterAccountId,
            initialAfterAccountName,
            initialAfterAccountEditedAmount,
            initialAfterAccountBody
          );
          await accountEdit(
            editBeforeAccountId,
            editBeforeAccountName,
            beforeAccountEditedAmount,
            editBeforeAccountBody
          );
          await accountEdit(
            editAfterAccountId,
            editAfterAccountName,
            afterAccountEditedAmount,
            editAfterAccountBody
          );

          const editedTransfer = {
            id: id,
            before_account_id: editBeforeAccountId,
            after_account_id: editAfterAccountId,
            after_account_name: editAfterAccountName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const editedInitialAfterAccount = {
            id: initialAfterAccountId,
            name: initialAfterAccountName,
            amount: initialAfterAccountEditedAmount,
            body: initialAfterAccountBody,
          };
          const editedBeforeAccount = {
            id: editBeforeAccountId,
            name: editBeforeAccountName,
            amount: beforeAccountEditedAmount,
            body: editBeforeAccountBody,
          };
          const editedAfterAccount = {
            id: editAfterAccountId,
            name: editAfterAccountName,
            amount: afterAccountEditedAmount,
            body: editAfterAccountBody,
          };

          onAccountUpdate(editedInitialAfterAccount);
          onAccountUpdate(editedBeforeAccount);
          onAccountUpdate(editedAfterAccount);
          onTransferUpdate(editedTransfer);
        } else if (
          editBeforeAccountId !== initialBeforeAccountId &&
          editAfterAccountId !== initialAfterAccountId
        ) {
          const initialBeforeAccountEditedAmount =
            parseFloat(String(initialBeforeAccountAmount)) +
            parseFloat(String(initialAmount));
          const initialAfterAccountEditedAmount =
            parseFloat(String(initialAfterAccountAmount)) -
            parseFloat(String(initialAmount));
          const beforeAccountEditedAmount =
            parseFloat(String(editBeforeAccountAmount)) -
            parseFloat(String(editAmount));
          const afterAccountEditedAmount =
            parseFloat(String(editAfterAccountAmount)) +
            parseFloat(String(editAmount));

          await transferEdit(
            id,
            editBeforeAccountId,
            editAfterAccountId,
            editAmount,
            editSchedule,
            editRepetition,
            editRepetitionType,
            editRepetitionSettings,
            editBody
          );
          await accountEdit(
            initialBeforeAccountId,
            initialBeforeAccountName,
            initialBeforeAccountEditedAmount,
            initialBeforeAccountBody
          );
          await accountEdit(
            initialAfterAccountId,
            initialAfterAccountName,
            initialAfterAccountEditedAmount,
            initialAfterAccountBody
          );
          await accountEdit(
            editBeforeAccountId,
            editBeforeAccountName,
            beforeAccountEditedAmount,
            editBeforeAccountBody
          );
          await accountEdit(
            editAfterAccountId,
            editAfterAccountName,
            afterAccountEditedAmount,
            editAfterAccountBody
          );

          const editedTransfer = {
            id: id,
            before_account_id: editBeforeAccountId,
            after_account_id: editAfterAccountId,
            after_account_name: editAfterAccountName,
            amount: editAmount,
            schedule: editSchedule,
            repetition: editRepetition,
            repetition_type: editRepetitionType,
            repetition_settings: editRepetitionSettings,
            body: editBody,
          };
          const editedInitialBeforeAccount = {
            id: initialBeforeAccountId,
            name: initialBeforeAccountName,
            amount: initialBeforeAccountEditedAmount,
            body: initialBeforeAccountBody,
          };
          const editedInitialAfterAccount = {
            id: initialAfterAccountId,
            name: initialAfterAccountName,
            amount: initialAfterAccountEditedAmount,
            body: initialAfterAccountBody,
          };
          const editedBeforeAccount = {
            id: editBeforeAccountId,
            name: editBeforeAccountName,
            amount: beforeAccountEditedAmount,
            body: editBeforeAccountBody,
          };
          const editedAfterAccount = {
            id: editAfterAccountId,
            name: editAfterAccountName,
            amount: afterAccountEditedAmount,
            body: editAfterAccountBody,
          };

          onAccountUpdate(editedInitialBeforeAccount);
          onAccountUpdate(editedInitialAfterAccount);
          onAccountUpdate(editedBeforeAccount);
          onAccountUpdate(editedAfterAccount);
          onTransferUpdate(editedTransfer);
        }
      }
    } catch (error) {
      console.error("Failed to edit transfer:", error);
    }
  };

  useEffect(() => {
    if (editAmount > 0) {
      setEditAmountError(false);
    } else {
      setEditAmountError(true);
    }

    if (
      parseFloat(String(editBeforeAccountAmount)) >=
      parseFloat(String(editAmount))
    ) {
      console.log(123456789);
      console.log(typeof editBeforeAccountAmount);
      console.log(typeof editAmount);
      setEditAmountOverError(false);
    } else {
      console.log(987654321);
      console.log(typeof editBeforeAccountAmount);
      console.log(typeof editAmount);
      setEditAmountOverError(true);
    }
  }, [editBeforeAccountAmount, editAmount]);

  // フォームの変更を処理するハンドラー
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

  const handleBeforeAccountChange = (
    event: ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    setEditBeforeAccountId(value);
    console.log(editBeforeAccountAmount);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setEditBeforeAccountName(selectedAccount.name);
      setEditBeforeAccountAmount(selectedAccount.amount);
      setEditBeforeAccountBody(selectedAccount.body);
    } else {
      setEditBeforeAccountName("");
      setEditBeforeAccountAmount(0);
      setEditBeforeAccountBody("");
    }
  };

  const handleAfterAccountChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setEditAfterAccountId(value);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setEditAfterAccountName(selectedAccount.name);
      setEditAfterAccountAmount(selectedAccount.amount);
      setEditAfterAccountBody(selectedAccount.body);
    } else {
      setEditAfterAccountName("");
      setEditAfterAccountAmount(0);
      setEditAfterAccountBody("");
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

  // 「繰り返し」を押されたとき
  const handleRepetitionDialogOpen = () => {
    setRepetitionDialogOpen(true);
    setPeriod("daily");
  };

  // 繰り返しダイアログの枠外をクリックされたとき
  const handleRepetitionDialogCancel = () => {
    setRepetitionDialogOpen(false);
    setFrequency(
      editRepetitionSettings && editRepetitionSettings[0]
        ? editRepetitionSettings[0]
        : 1
    );
    setSelectedDays(
      editRepetitionSettings && editRepetitionSettings.length > 1
        ? editRepetitionSettings.slice(1)
        : []
    );
    setPeriod(editRepetitionType ? editRepetitionType : "");
  };

  // 繰り返しダイアログの削除ボタン押されたとき
  const handleRepetitionDialogDelete = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(false);
    setEditRepetitionType("");
    setEditRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("");
  };

  // 繰り返しダイアログの設定ボタン押されたとき
  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setEditRepetition(true);
    setEditRepetitionType(period);
    setEditRepetitionSettings([frequency, ...selectedDays]);
  };

  // 日付が変更されたとき
  const handleSchedulChange = (date: Date) => {
    setEditSchedule(date);
  };

  // 保存ボタン押したとき
  const handleSave = () => {
    if (editAmount > 0) {
      editTransfer(id);
      onClose();
    } else {
      setEditAmountError(true);
    }
  };

  const handleFrequencyChange = (delta) => {
    setFrequency((prev) => Math.max(1, prev + delta));
  };

  const handlePeriodChange = (event, newPeriod: string | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      if (newPeriod !== "weekly") {
        setSelectedDays([]);
      }
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev.filter((d) => d !== day), day].sort((a, b) => {
            const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];
            return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
          })
    );
  };

  const calculateNextSchedule = () => {
    if (!editRepetition) return ""; // 繰り返し設定がオフの場合は空文字を返す

    // 曜日名を整数にマッピングする関数
    const mapDayOfWeekToInt = (dayOfWeek) => {
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
          return NaN; // 不正な曜日名の場合はNaNを返す
      }
    };

    const date = new Date(editSchedule);
    const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
    const currentMonth = date.getMonth(); // 予定の日付の月を取得
    const currentYear = date.getFullYear(); // 予定の日付の年を取得
    let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

    switch (editRepetitionType) {
      case "daily":
        nextSchedule += editRepetitionSettings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
        break;

      case "weekly":
        if (editRepetitionSettings.length > 1) {
          const targetDaysOfWeek = editRepetitionSettings
            .slice(1)
            .map(mapDayOfWeekToInt);
          const currentDayOfWeek = date.getDay(); // 現在の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
          let daysUntilNextSchedule = 1;

          // 現在の曜日が次の予定日の曜日リストに含まれていない場合、次の予定日を計算
          for (let i = 1; i <= 7; i++) {
            const nextDayOfWeek = (currentDayOfWeek + i) % 7; // 翌日の曜日を計算
            if (targetDaysOfWeek.includes(nextDayOfWeek)) {
              daysUntilNextSchedule = i;
              break;
            }
          }

          // 現在の曜日と次の予定日の曜日が同じ場合、次の予定日を1日進めてから計算
          if (daysUntilNextSchedule === 0) {
            date.setDate(date.getDate() + 1);
            daysUntilNextSchedule = 7;
          }

          nextSchedule +=
            (daysUntilNextSchedule + (editRepetitionSettings[0] - 1) * 7) *
            24 *
            60 *
            60 *
            1000;
        }
        break;

      case "monthly":
        // 次の予定日の年と月を計算
        let nextYear = currentYear;
        let nextMonth = currentMonth + editRepetitionSettings[0];
        if (nextMonth === 12) {
          nextYear++;
          nextMonth = 0; // 0 は 1 月を表す
        }

        // 次の予定日を計算
        const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const nextDayOfMonth = Math.min(date.getDate(), daysInNextMonth);
        const nextDate = new Date(nextYear, nextMonth, nextDayOfMonth);
        nextSchedule = nextDate.getTime();
        break;

      default:
        break;
    }

    // 次の予定日を Date オブジェクトに変換して返す
    return new Date(nextSchedule);
  };

  const nextSchedule = calculateNextSchedule();

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""; // 日付が未定義の場合は空文字を返す

    return moment(date).format("MM/DD/YY");
  };

  const isDialogFormValid =
    period === "daily" ||
    period === "monthly" ||
    (period === "weekly" && selectedDays.length > 0);

  return (
    <Box width={560} height={770}>
      <Dialog
        open={repetitionDialogOpen}
        onClose={handleRepetitionDialogCancel}
        fullWidth
        maxWidth="xs"
      >
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
                {["月", "火", "水", "木", "金", "土", "日"].map(
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
            ))}
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
            ))}
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
          <Typography variant="subtitle1">予定</Typography>
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
        <li className="pt-5">
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
          <Typography>
            {editRepetitionSettings && (
              <>
                {editRepetitionType === "daily" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎日`}
                {editRepetitionType === "weekly" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎週 ${editRepetitionSettings.slice(1).join(" ")}`}
                {editRepetitionType === "monthly" &&
                  editRepetitionSettings[0] === 1 &&
                  `毎月`}
                {editRepetitionSettings[0] > 1 &&
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
          <Typography>
            {editRepetition === true && (
              <>次回の予定：{formatDate(nextSchedule)}</>
            )}
          </Typography>
        </li>
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
            <Button variant="contained" onClick={handleSave} color="primary">
              保存
            </Button>
          </Stack>
          <IconButton
            onClick={() => onDelete(id)}
            className="absolute right-0 bottom-0 m-8"
          >
            <DeleteIcon />
          </IconButton>
        </li>
      </ul>
    </Box>
  );
};
