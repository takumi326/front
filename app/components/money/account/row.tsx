"use client";
import React, { useState, useContext } from "react";
import moment from "moment";

import {
  IconButton,
  TableCell,
  TableRow,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { accountEdit, accountDelete } from "@/lib/api/account-api";
import { transferDelete } from "@/lib/api/transfer-api";

import {
  accountData,
  accountRowProps,
  displayAccountData,
} from "@/interface/account-interface";

import { transferData } from "@/interface/transfer-interface";

import { AccountShow } from "@/components/money/account/show";
import { TransferShow } from "@/components/money/transfer/show";

export const AccountRow: React.FC<accountRowProps> = (props) => {
  const { row, visibleColumns } = props;
  const {
    accounts,
    transfers,
    repetitionMoneies,
    setIsEditing,
    loading,
    setLoading,
  } = useContext(moneyContext);
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

  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isEditTransferModalOpen, setIsEditTransferModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

  const handleOpenEditAccountModal = () => {
    setIsEditAccountModalOpen(true);
  };

  const handleCloseEditAccountModal = () => {
    setIsEditAccountModalOpen(false);
  };

  const handleOpenEditTransferModal = (index: number) => {
    setIsEditTransferModalOpen(true);
    setIsHistory(index);
  };

  const handleCloseEditTransferModal = () => {
    setIsEditTransferModalOpen(false);
    setIsHistory(0);
  };

  const deleteTransfer = async (id: string, index: number) => {
    setLoading(true);
    const selectedBeforeAccount: accountData = accounts.filter(
      (account) =>
        account.id === sortedHistoryRows[index].transfer_before_account_id
    )[0];
    const selectedAfterAccount: accountData = accounts.filter(
      (account) =>
        account.id === sortedHistoryRows[index].transfer_after_account_id
    )[0];
    try {
      if (sortedHistoryRows[index].transfer_repetition === true) {
        let beforeAccountEditedAmount = parseFloat(
          String(selectedBeforeAccount.amount)
        );
        let afterAccountEditedAmount = parseFloat(
          String(selectedAfterAccount.amount)
        );

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

        for (const repetitionMoney of repetitionMoneies.filter(
          (repetitionMoney) =>
            repetitionMoney.transaction_type === "transfer" &&
            repetitionMoney.transfer_id === id &&
            new Date(repetitionMoney.repetition_schedule).getTime() <=
              endOfCurrentDay.getTime()
        )) {
          beforeAccountEditedAmount += parseFloat(
            String(repetitionMoney.amount)
          );
          afterAccountEditedAmount -= parseFloat(
            String(repetitionMoney.amount)
          );
        }

        await accountEdit(
          selectedBeforeAccount.id,
          selectedBeforeAccount.name,
          beforeAccountEditedAmount,
          selectedBeforeAccount.body
        );
        await accountEdit(
          selectedAfterAccount.id,
          selectedAfterAccount.name,
          afterAccountEditedAmount,
          selectedAfterAccount.body
        );
      } else {
        const beforeAccountEditedAmount =
          parseFloat(String(selectedBeforeAccount.amount)) +
          parseFloat(String(sortedHistoryRows[index].transfer_amount));
        const afterAccountEditedAmount =
          parseFloat(String(selectedAfterAccount.amount)) -
          parseFloat(String(sortedHistoryRows[index].transfer_amount));

        await accountEdit(
          selectedBeforeAccount.id,
          selectedBeforeAccount.name,
          beforeAccountEditedAmount,
          selectedBeforeAccount.body
        );
        await accountEdit(
          selectedAfterAccount.id,
          selectedAfterAccount.name,
          afterAccountEditedAmount,
          selectedAfterAccount.body
        );
      }
      transferDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit  transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: string) => {
    setLoading(true);
    const selectedBeforeTransfer: transferData[] = transfers.filter(
      (transfer) => transfer.before_account_id === id
    );
    const selectedAfterTransfer: transferData[] = transfers.filter(
      (transfer) => transfer.after_account_id === id
    );
    try {
      for (let i = 0; i < selectedBeforeTransfer.length; i += 1) {
        await transferDelete(selectedBeforeTransfer[i].id);
      }
      for (let t = 0; t < selectedAfterTransfer.length; t += 1) {
        await transferDelete(selectedAfterTransfer[t].id);
      }
      await accountDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setLoading(false);
    }
  };

  const repetitionAllMoney = (id: string) => {
    let money = 0;
    repetitionMoneies
      .filter(
        (repetitionMoney) =>
          repetitionMoney.transfer_id === id &&
          new Date(repetitionMoney.repetition_schedule).getTime() <=
            endOfCurrentDay.getTime()
      )
      .map(
        (repetitionMoney) =>
          (money += parseFloat(String(repetitionMoney.amount)))
      );
    return Number(money);
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

  const renderRepetition = (index: number) => {
    const { transfer_repetition_type, transfer_repetition_settings } =
      sortedHistoryRows[index];
    if (!transfer_repetition_type || !transfer_repetition_settings) return "";

    if (
      transfer_repetition_type === "daily" &&
      Number(transfer_repetition_settings[0]) === 1
    ) {
      return "毎日";
    } else if (
      transfer_repetition_type === "weekly" &&
      Number(transfer_repetition_settings[0]) === 1
    ) {
      return `毎週 ${transfer_repetition_settings.slice(1).join(" ")}`;
    } else if (
      transfer_repetition_type === "monthly" &&
      Number(transfer_repetition_settings[0]) === 1
    ) {
      return "毎月";
    } else if (Number(transfer_repetition_settings[0]) > 1) {
      return `毎${transfer_repetition_settings[0]}${
        transfer_repetition_type === "daily"
          ? "日"
          : transfer_repetition_type === "weekly"
          ? `週 ${transfer_repetition_settings.slice(1).join(" ")}`
          : "月"
      }`;
    } else {
      return "";
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "";
    return moment(date).format("MM/DD/YY");
  };

  const sortedHistoryRows = row.history.slice().sort((a, b) => {
    if (a.transfer_repetition && !b.transfer_repetition) {
      return -1;
    } else if (!a.transfer_repetition && b.transfer_repetition) {
      return 1;
    }

    const dateA = new Date(a.transfer_schedule).getTime();
    const dateB = new Date(b.transfer_schedule).getTime();
    return dateA - dateB;
  });

  return (
    <React.Fragment>
      {isEditAccountModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditAccountModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <AccountShow
              id={row.id}
              name={row.account_name}
              amount={row.account_amount}
              body={row.account_body}
              onClose={handleCloseEditAccountModal}
              onDelete={deleteAccount}
            />
          </div>
        </div>
      )}

      {isEditTransferModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditTransferModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <TransferShow
              id={sortedHistoryRows[isHistory].transfer_id}
              before_account_id={
                sortedHistoryRows[isHistory].transfer_before_account_id
              }
              after_account_id={
                sortedHistoryRows[isHistory].transfer_after_account_id
              }
              amount={sortedHistoryRows[isHistory].transfer_amount}
              schedule={sortedHistoryRows[isHistory].transfer_schedule}
              end_date={sortedHistoryRows[isHistory].transfer_end_date}
              repetition={sortedHistoryRows[isHistory].transfer_repetition}
              repetition_type={
                sortedHistoryRows[isHistory].transfer_repetition_type
              }
              repetition_settings={
                sortedHistoryRows[isHistory].transfer_repetition_settings
              }
              body={sortedHistoryRows[isHistory].transfer_body}
              onClose={handleCloseEditTransferModal}
            />
          </div>
        </div>
      )}

      <TableRow
        key={row.id}
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor: isHistoryOpen ? "#f5f5f5" : "transparent",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            {isHistoryOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        {Object.keys(visibleColumns).map((key) =>
          visibleColumns[key] ? (
            <TableCell key={key} component="th" scope="row">
              {key === "account_name" ? (
                <button
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleOpenEditAccountModal}
                >
                  {row.account_name}
                </button>
              ) : key === "account_amount" ? (
                formatAmountCommas(row.account_amount)
              ) : (
                String(row[key as keyof displayAccountData])
              )}
            </TableCell>
          ) : null
        )}
        <TableCell align="right">
          {loading ? (
            <Typography variant="subtitle1">...</Typography>
          ) : (
            <IconButton onClick={() => deleteAccount(row.id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {row.history.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  自分口座間の送金履歴
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>送金先口座</TableCell>
                      <TableCell>金額</TableCell>
                      <TableCell>繰り返し</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedHistoryRows.map((historyRow, historyIndex) => (
                      <TableRow
                        key={historyRow.transfer_id}
                        sx={{
                          "& > *": {
                            borderBottom: "unset",
                            backgroundColor: isHistoryOpen
                              ? new Date(
                                  historyRow.transfer_schedule
                                ).getTime() <=
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  new Date().getDate(),
                                  23,
                                  59,
                                  0,
                                  0
                                ).getTime()
                                ? "#f5f5f5"
                                : "#bfbfbf"
                              : "transparent",
                          },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {historyRow.transfer_repetition === false
                            ? formatDate(historyRow.transfer_schedule)
                            : ""}
                        </TableCell>
                        <TableCell>
                          <button
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleOpenEditTransferModal(historyIndex)
                            }
                          >
                            {historyRow.transfer_after_account_name}
                          </button>
                        </TableCell>
                        <TableCell>
                          {historyRow.transfer_repetition === false
                            ? formatAmountCommas(historyRow.transfer_amount)
                            : formatAmountCommas(
                                repetitionAllMoney(historyRow.transfer_id)
                              )}
                        </TableCell>
                        <TableCell>{renderRepetition(historyIndex)}</TableCell>
                        <TableCell align="right">
                          {loading ? (
                            <Typography variant="subtitle1">...</Typography>
                          ) : (
                            <IconButton
                              onClick={() =>
                                deleteTransfer(
                                  historyRow.transfer_id,
                                  historyIndex
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};
