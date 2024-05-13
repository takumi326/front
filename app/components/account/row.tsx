"use client";
import React, { useState, ChangeEvent, useContext } from "react";
import moment from "moment";

import {
  Checkbox,
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

import { accountEdit as Edit } from "@/lib/api/account-api";
import { accountRowProps, accountData } from "@/interface/account-interface";
import {
  columnAccountNames,
  displayAccountData,
  selectAccountData,
} from "@/interface/account-interface";
import { AccountShow } from "@/components/account/show";

import {
  transferData,
  columnTransferNames,
  selectTransferData,
} from "@/interface/transfer-interface";

// 表の行コンポーネント
export const AccountRow: React.FC<accountRowProps> = (props) => {
  const {
    row,
    // onSelect,
    // onAllSelect,
    // isSelected,
    visibleColumns,
    onAccountUpdate,
    onTransferUpdate,
    onAccountDelete,
    onTransferDelete,
  } = props;
  const {
    classifications,
    setClassifications,
    categories,
    setCategories,
    payments,
    setPayments,
    incomes,
    setIncomes,
    accounts,
    setAccounts,
    transfers,
    setTransfers,
  } = useContext(moneyContext);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isEditTransferModalOpen, setIsEditTransferModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // const [isChecked, setIsChecked] = useState(row.completed);

  //   const [openRowId, setOpenRowId] = useState<string | null>(null);

  // const handleToggleRow = (rowId: string) => {
  //   setOpenRowId(openRowId === rowId ? null : rowId);
  // };

  const handleOpenEditAccountModal = () => {
    setIsEditAccountModalOpen(true);
  };

  const handleCloseEditAccountModal = () => {
    setIsEditAccountModalOpen(false);
  };

  const handleOpenEditTransferModal = () => {
    setIsEditTransferModalOpen(true);
  };

  const handleCloseEditTransferModal = () => {
    setIsEditTransferModalOpen(false);
  };

  // const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   e.stopPropagation();
  //   onSelect(row.history.transfer_id);
  // };

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";

    return moment(date).format("MM/DD/YY");
  };

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
              onUpdate={onAccountUpdate}
              onClose={handleCloseEditAccountModal}
              onDelete={onAccountDelete}
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
              id={row.history.transfer_id}
              before_account_id={row.history.transfer_before_account_id}
              before_account_name={row.history.transfer_before_account_nam}
              after_account_id={row.history.transfer_after_account_id}
              amount={row.history.transfer_amount}
              schedule={row.history.transfer_schedule}
              repetition={row.history.transfer_repetition}
              repetition_type={row.history.transfer_repetition_type}
              repetition_settings={row.history.transfer_repetition_settings}
              body={row.history.transfer_body}
              onUpdate={onTransferUpdate}
              onClose={handleCloseEditTransferModal}
              onDelete={onTransferDelete}
            />
          </div>
        </div>
      )}

      <TableRow
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
          <IconButton onClick={() => onAccountDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {row.history.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  自分口座間の入金履歴
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>日付</TableCell>
                      <TableCell>入金元口座</TableCell>
                      <TableCell align="right">金額</TableCell>
                      <TableCell align="right">繰り返し</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.transfer_id}>
                        <TableCell component="th" scope="row">
                          {formatDate(historyRow.transfer_schedule)}
                        </TableCell>
                        <TableCell>
                          <button
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={handleOpenEditTransferModal}
                          >
                            {historyRow.transfer_before_account_name}
                          </button>
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.transfer_amount}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.transfer_repetition_type}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              onTransferDelete(historyRow.transfer_id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
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
