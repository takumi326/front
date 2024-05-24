"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { moneyContext } from "@/context/money-context";

import { transferNew } from "@/lib/api/transfer-api";
import { accountEdit } from "@/lib/api/account-api";
import { transferNewProps } from "@/interface/account-interface";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const TransferNew: React.FC<transferNewProps> = (props) => {
  const { onAccountUpdate, onTransferAdd, onClose } = props;
  const { accounts } = useContext(moneyContext);
  const initialDateObject = new Date();

  const [repetitionDialogOpen, setRepetitionDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [period, setPeriod] = useState("");

  const [newBeforeAccountId, setNewBeforeAccountId] = useState("");
  const [newBeforeAccountName, setNewBeforeAccountName] = useState("");
  const [newBeforeAccountAmount, setNewBeforeAccountAmount] =
    useState<number>(0);
  const [newBeforeAccountBody, setNewBeforeAccountBody] = useState("");
  const [newAfterAccountId, setNewAfterAccountId] = useState("");
  const [newAfterAccountName, setNewAfterAccountName] = useState("");
  const [newAfterAccountAmount, setNewAfterAccountAmount] = useState<number>(0);
  const [newAfterAccountBody, setNewAfterAccountBody] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newAmountString, setNewAmountString] = useState("0");
  const [newAmountError, setNewAmountError] = useState<boolean>(false);
  const [newAmountOverError, setNewAmountOverError] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<Date>(initialDateObject);
  const [newRepetition, setNewRepetition] = useState<boolean>(false);
  const [newRepetitionType, setNewRepetitionType] = useState("");
  const [newRepetitionSettings, setNewRepetitionSettings] = useState([]);
  const [newBody, setNewBody] = useState("");
  const [isBeforeTitleFormValid, setIsBeforeTitleFormValid] = useState(true);
  const [isAfterTitleFormValid, setIsAfterTitleFormValid] = useState(true);

  const newTransfer = async () => {
    try {
      const beforeAccountEditedAmount =
        parseFloat(String(newBeforeAccountAmount)) -
        parseFloat(String(newAmount));
      const afterAccountEditedAmount =
        parseFloat(String(newAfterAccountAmount)) +
        parseFloat(String(newAmount));

      const transferResponse = await transferNew(
        newBeforeAccountId,
        newAfterAccountId,
        newAmount,
        newSchedule,
        newRepetition,
        newRepetitionType,
        newRepetitionSettings,
        newBody
      );
      await accountEdit(
        newBeforeAccountId,
        newBeforeAccountName,
        beforeAccountEditedAmount,
        newBeforeAccountBody
      );
      await accountEdit(
        newAfterAccountId,
        newAfterAccountName,
        afterAccountEditedAmount,
        newAfterAccountBody
      );

      const newTransfer = {
        id: transferResponse.id,
        before_account_id: transferResponse.before_account_id,
        after_account_id: transferResponse.after_account_id,
        after_account_name: newAfterAccountName,
        amount: transferResponse.amount,
        schedule: transferResponse.schedule,
        repetition: transferResponse.repetition,
        repetition_type: transferResponse.repetition_type,
        repetition_settings: transferResponse.repetition_settings,
        body: transferResponse.body,
      };
      const beforeAccount = {
        id: newBeforeAccountId,
        name: newBeforeAccountName,
        amount: beforeAccountEditedAmount,
        body: newBeforeAccountBody,
      };
      const afterAccount = {
        id: newAfterAccountId,
        name: newAfterAccountName,
        amount: afterAccountEditedAmount,
        body: newAfterAccountBody,
      };

      onAccountUpdate(beforeAccount);
      onAccountUpdate(afterAccount);
      onTransferAdd(newTransfer);
    } catch (error) {
      console.error("Failed to create transfer:", error);
    }
  };

  useEffect(() => {
    if (newAmount > 0) {
      setNewAmountError(false);
    } else {
      setNewAmountError(true);
    }
    if (newBeforeAccountAmount >= newAmount) {
      setNewAmountOverError(false);
    } else {
      setNewAmountOverError(true);
    }
  }, [newAmount, newBeforeAccountId]);

  // フォームの変更を処理するハンドラー
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
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

  const handleBeforeAccountChange = (
    event: ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    setNewBeforeAccountId(value);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setNewBeforeAccountName(selectedAccount.name);
      setNewBeforeAccountAmount(selectedAccount.amount);
      setNewBeforeAccountBody(selectedAccount.body);
      setIsBeforeTitleFormValid(false);
    } else {
      setNewBeforeAccountName("");
      setNewBeforeAccountAmount(0);
      setNewBeforeAccountBody("");
    }
  };

  const handleAfterAccountChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setNewAfterAccountId(value);
    const selectedAccount = accounts.find((account) => account.id === value);
    if (selectedAccount) {
      setNewAfterAccountName(selectedAccount.name);
      setNewAfterAccountAmount(selectedAccount.amount);
      setNewAfterAccountBody(selectedAccount.body);
      setIsAfterTitleFormValid(false);
    } else {
      setNewAfterAccountName("");
      setNewAfterAccountAmount(0);
      setNewAfterAccountBody("");
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
      newRepetitionSettings && newRepetitionSettings[0]
        ? newRepetitionSettings[0]
        : 1
    );
    setSelectedDays(
      newRepetitionSettings && newRepetitionSettings.length > 1
        ? newRepetitionSettings.slice(1)
        : []
    );
    setPeriod(newRepetitionType ? newRepetitionType : "");
  };

  // 繰り返しダイアログの削除ボタン押されたとき
  const handleRepetitionDialogDelete = () => {
    setRepetitionDialogOpen(false);
    setNewRepetition(false);
    setNewRepetitionType("");
    setNewRepetitionSettings([]);
    setFrequency(1);
    setSelectedDays([]);
    setPeriod("");
  };

  // 繰り返しダイアログの設定ボタン押されたとき
  const handleRepetitionSave = () => {
    setRepetitionDialogOpen(false);
    setNewRepetition(true);
    setNewRepetitionType(period);
    setNewRepetitionSettings([frequency, ...selectedDays]);
  };

  // 日付が変更されたとき
  const handleSchedulChange = (date: Date) => {
    setNewSchedule(date);
  };

  // 保存ボタン押したとき
  const handleSave = () => {
    newTransfer();
    onClose();
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
    if (!newRepetition) return ""; // 繰り返し設定がオフの場合は空文字を返す

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

    const date = new Date(newSchedule);
    const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
    const currentMonth = date.getMonth(); // 予定の日付の月を取得
    const currentYear = date.getFullYear(); // 予定の日付の年を取得
    let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

    switch (newRepetitionType) {
      case "daily":
        nextSchedule += newRepetitionSettings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
        break;

      case "weekly":
        if (newRepetitionSettings.length > 1) {
          const targetDaysOfWeek = newRepetitionSettings
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
            (daysUntilNextSchedule + (newRepetitionSettings[0] - 1) * 7) *
            24 *
            60 *
            60 *
            1000;
        }
        break;

      case "monthly":
        // 次の予定日の年と月を計算
        let nextYear = currentYear;
        let nextMonth = currentMonth + newRepetitionSettings[0];
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
            value={newBeforeAccountId}
            onChange={handleBeforeAccountChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {accounts
              .filter((account) => account.id !== newAfterAccountId)
              .map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
          </Select>
          {accounts
            .filter((account) => account.id === newBeforeAccountId)
            .map((account) => (
              <Typography key={account.id} align="left" variant="subtitle1">
                口座金額：{formatAmountCommas(account.amount)}
              </Typography>
            ))}
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
            value={newAfterAccountId}
            onChange={handleAfterAccountChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {accounts
              .filter((account) => account.id !== newBeforeAccountId)
              .map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
          </Select>
          {accounts
            .filter((account) => account.id === newAfterAccountId)
            .map((account) => (
              <Typography key={account.id} align="left" variant="subtitle1">
                口座金額：{formatAmountCommas(account.amount)}
              </Typography>
            ))}
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
        <li>
          {newAmountError && (
            <Typography align="left" variant="subtitle1">
              金額を0以上にして下さい
            </Typography>
          )}
          {newAmountOverError && (
            <Typography align="left" variant="subtitle1">
              送金元口座に入っているお金以下にして下さい
            </Typography>
          )}
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
            {newRepetitionSettings && (
              <>
                {newRepetitionType === "daily" &&
                  newRepetitionSettings[0] === 1 &&
                  `毎日`}
                {newRepetitionType === "weekly" &&
                  newRepetitionSettings[0] === 1 &&
                  `毎週 ${newRepetitionSettings.slice(1).join(" ")}`}
                {newRepetitionType === "monthly" &&
                  newRepetitionSettings[0] === 1 &&
                  `毎月`}
                {newRepetitionSettings[0] > 1 &&
                  newRepetitionSettings &&
                  `毎${newRepetitionSettings[0]}${
                    newRepetitionType === "daily"
                      ? "日"
                      : newRepetitionType === "weekly"
                      ? `週 ${newRepetitionSettings.slice(1).join(" ")}`
                      : "月"
                  }`}
              </>
            )}
          </Typography>
          {/* <Typography>
            {newRepetition === true && (
              <>次回の予定：{formatDate(nextSchedule)}</>
            )}
          </Typography> */}
        </li>
        <li className="pt-5">
          {newRepetition === true ? (
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
              selectedDate={newSchedule}
              onChange={handleSchedulChange}
            />
          </Box>
        </li>
        <li className="pt-5">
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
              disabled={
                isBeforeTitleFormValid ||
                isAfterTitleFormValid ||
                newAmountError ||
                newAmountOverError
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
