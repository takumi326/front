"use client";
import React, { useState, useEffect, useContext } from "react";

import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import {
  paymentGetData,
  paymentDelete,
} from "@/lib/api/payment-api";
import {
  paymentData,
  columnPaymentNames,
  selectPaymentData,
} from "@/interface/payment-interface";
import { PaymentRow } from "@/components/payment/row";
import { PaymentNew } from "@/components/payment/new";

import {
  incomeGetData,
  incomeDelete,
} from "@/lib/api/income-api";
import {
  incomeData,
  columnIncomeNames,
  selectIncomeData,
} from "@/interface/income-interface";
import { IncomeRow } from "@/components/income/row";
import { IncomeNew } from "@/components/income/new";

import {
  transferGetData,
  transferDelete,
} from "@/lib/api/transfer-api";
import {
  transferData,
  columnTransferNames,
  selectTransferData,
} from "@/interface/transfer-interface";
import { TransferRow } from "@/components/transfer/row";
import { TransferNew } from "@/components/transfer/new";

import {
  accountGetData,
  accountDelete,
} from "@/lib/api/account-api";
import {
  accountData,
  columnAccountNames,
  selectAccountData,
} from "@/interface/account-interface";
import { AccountRow } from "@/components/account/row";
import { AccountNew } from "@/components/account/new";

import {
  categoryGetData,
  categoryDelete,
} from "@/lib/api/category-api";
import {
  categoryData,
  columnCategoryNames,
  selectCategoryData,
} from "@/interface/category-interface";
import { CategoryRow } from "@/components/category/row";
import { CategoryNew } from "@/components/category/new";


import {
  classificationGetData,
  classificationDelete,
} from "@/lib/api/classification-api";
import {
  classificationData,
  columnClassificationNames,
  selectClassificationData,
} from "@/interface/classification-interface";
import { ClassificationRow } from "@/components/classification/row";
import { ClassificationNew } from "@/components/classification/new";

export const MoneyTable: React.FC = () => {
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

  const [rows, setRows] = useState<accountData[]>([]);
  const [selectrows, setSelectRows] = useState<selectAccountData[]>([]);
  const [completedAccounts, setCompletedAccounts] = useState<accountData[]>([]);
  const [incompleteAccounts, setIncompleteAccounts] = useState<accountData[]>(
    []
  );

  const [filter, setFilter] = useState<"payment" | "income" | "account">(
    "payment"
  );

  const [displayedAccounts, setDisplayedAccounts] = useState<accountData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

  useEffect(() => {
    const updaterows =
      filter === "payment"
        ? accounts.map((item) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            body: item.body,
          }))
        : filter === "income"
        ? accounts.map((item) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            body: item.body,
          }))
        : accounts.map((item) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            body: item.body,
          }));
    setRows(updaterows);
  }, [filter]);

  useEffect(() => {
    const updateselectrows =
      filter === "payment"
        ? accounts.map((item) => ({
            name: item.name,
            amount: item.amount,
          }))
        : filter === "income"
        ? accounts.map((item) => ({
            name: item.name,
            amount: item.amount,
          }))
        : accounts.map((item) => ({
            name: item.name,
            amount: item.amount,
          }));
    setSelectRows(updateselectrows);
  }, [filter]);

  const [orderBy, setOrderBy] = useState<keyof (typeof selectrows)[0]>("name");

  const [order, setOrder] = useState<{
    [key: string]: "asc" | "desc" | "default";
  }>({
    name: "default",
    amount: "default",
  });

  useEffect(() => {
    const updateorderBy: {
      [key: string]: "asc" | "desc" | "default";
    } =
      filter === "payment"
        ? {
            name: "default",
            amount: "default",
          }
        : filter === "income"
        ? {
            name: "default",
            amount: "default",
          }
        : {
            name: "default",
            amount: "default",
          };
    setOrder(updateorderBy);
  }, [filter]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [columnSettings, setColumnSettings] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (selectrows.length > 0) {
      const initialSettings: { [key: string]: boolean } = {};
      Object.keys(selectrows[0]).forEach((key) => {
        initialSettings[key] = true;
      });
      return initialSettings;
    } else {
      // rows が空の場合は適切な初期設定を行う
      return {
        name: true,
        amount: true,
      };
    }
  });

  useEffect(() => {
    getData().then((data) => {
      setAccounts(data);
      console.log(accounts);
    });
  }, [isEditing, isAdding]);

  useEffect(() => {
    setIsEditing(false);
    setIsAdding(false);
  }, [accounts]);

  useEffect(() => {
    const completed = accounts.filter((account) => account.completed);
    const incomplete = accounts.filter((account) => !account.completed);
    setDisplayedAccounts(accounts);
    console.log(2);
  }, [accounts, isEditing, isAdding]);

  useEffect(() => {
    let filteredAccounts: accountData[] = [];
    if (filter === "payment") {
      filteredAccounts = accounts;
    } else if (filter === "income") {
      filteredAccounts = completedAccounts;
    } else if (filter === "account") {
      filteredAccounts = incompleteAccounts;
    }
    // 表示される目的を設定
    setDisplayedAccounts(filteredAccounts);
  }, [filter, accounts, completedAccounts, incompleteAccounts]);

  const handleFilterChange = (value: "payment" | "income" | "account") => {
    setFilter(value);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
  };

  // TableShow コンポーネント内での更新処理
  const newAccount = (newAccount: accountData) => {
    setAccounts([...accounts, newAccount]);
    setIsEditing(true);
  };

  // TableShow コンポーネント内での更新処理
  const updateAccount = (updateAccount: accountData) => {
    const updatedAccounts = accounts.map((account) => {
      if (account.id === updateAccount.id) {
        return updateAccount; // 編集されたデータで該当の目的を更新
      }
      return account;
    });
    setAccounts(updatedAccounts); // 更新された accounts ステートを設定
    setIsAdding(true);
  };

  const deleteAccount = async (id: string) => {
    try {
      console.log(id);
      await Delete(id);
      setAccounts(accounts.filter((account) => account.id !== id)); // UIからも削除
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const deleteAllAccount = async (ids: string[]) => {
    try {
      // 複数のIDに対して削除を実行
      await Promise.all(ids.map((id) => Delete(id)));
      // UIからも削除
      setAccounts(accounts.filter((account) => !ids.includes(account.id)));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleRequestSort = (property: keyof (typeof rows)[0]) => {
    let newOrder: "asc" | "desc" | "default" = "asc";
    if (orderBy === property) {
      // すでにソートされているカラムをクリックした場合、ソート順を切り替える
      newOrder =
        order[property] === "asc"
          ? "desc"
          : order[property] === "desc"
          ? "default"
          : "asc";
    }
    const newOrderState = { ...order, [property]: newOrder };
    setOrder(newOrderState);
    setOrderBy(property);
  };

  // データをソートする関数
  const sortedRows = displayedAccounts.slice().sort((a, b) => {
    const compare = (key: keyof (typeof rows)[0]) => {
      if (order[key] === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else if (order[key] === "desc") {
        return a[key] < b[key] ? 1 : -1;
      }
      return 0;
    };
    return compare(orderBy);
  });

  const handleSelectAllClick = () => {
    if (filter === "incomplete") {
      if (incompleteSelected.length === incompleteAccounts.length) {
        setIncompleteSelected([]);
        setSelected(selected.filter((id) => !incompleteSelected.includes(id)));
      } else {
        const allIds = incompleteAccounts.map((account) => account.id);
        setIncompleteSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else if (filter === "completed") {
      if (completedSelected.length === completedAccounts.length) {
        setCompletedSelected([]);
        setSelected(selected.filter((id) => !completedSelected.includes(id)));
      } else {
        const allIds = completedAccounts.map((account) => account.id);
        setCompletedSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else {
      if (selected.length === accounts.length) {
        setCompletedSelected([]);
        setIncompleteSelected([]);
        setSelected([]);
      } else {
        const allIds = accounts.map((account) => account.id);
        const allCompletedIds = completedAccounts.map((account) => account.id);
        const allIncompleteIds = incompleteAccounts.map(
          (account) => account.id
        );
        setCompletedSelected(allCompletedIds);
        setIncompleteSelected(allIncompleteIds);
        setSelected(allIds);
      }
    }
  };

  const handleSelect = (id: string, completed: boolean) => {
    if (completed) {
      if (completedSelected.includes(id)) {
        setCompletedSelected(completedSelected.filter((item) => item !== id));
        setSelected(completedSelected.filter((item) => item !== id));
      } else {
        setCompletedSelected([...completedSelected, id]);
        setSelected([...selected, id]);
      }
    } else {
      if (incompleteSelected.includes(id)) {
        setIncompleteSelected(incompleteSelected.filter((item) => item !== id));
        setSelected(incompleteSelected.filter((item) => item !== id));
      } else {
        setIncompleteSelected([...incompleteSelected, id]);
        setSelected([...selected, id]);
      }
    }
  };

  const isSelected = (id: string, completed: boolean) => {
    if (completed) {
      return completedSelected.includes(id);
    } else {
      return incompleteSelected.includes(id);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (property: keyof selectAccountData) => {
    setColumnSettings((prevSettings) => ({
      ...prevSettings,
      [property]: !prevSettings[property],
    }));
  };

  const visibleColumns = Object.fromEntries(
    Object.entries(columnSettings).filter(([key, value]) => value)
  );

  const handleDelete = (id: string) => {
    deleteAccount(id);
  };

  const handleAllDelete = () => {
    deleteAllAccount(selected);
    setCompletedSelected([]); // 選択をクリア
    setIncompleteSelected([]); // 選択をクリア
    setSelected([]); // 選択をクリア
  };

  const handleNewCloseModal = () => {
    setIsNewModalOpen(false);
  };

  return (
    <Box>
      {isNewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <AccountNew onAdd={newAccount} onClose={handleNewCloseModal} />
          </div>
        </div>
      )}
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant={filter === "payment" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("payment")}
          >
            支出
          </Button>
          <Button
            variant={filter === "income" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("income")}
          >
            収入
          </Button>
          <Button
            variant={filter === "account" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("account")}
          >
            預金
          </Button>
        </Stack>
        <Button
          aria-controls="column-menu"
          aria-haspopup="true"
          onClick={selected.length > 0 ? undefined : handleMenuClick}
        >
          {selected.length > 0 ? (
            <DeleteIcon onClick={() => handleAllDelete()} />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewClick}
          className="ml-auto"
        >
          新規作成
        </Button>
      </Stack>
      <Menu
        id="column-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {rows.length > 0 &&
          Object.keys(selectrows[0]).map((key) => (
            <MenuItem
              key={key}
              onClick={() => handleColumnToggle(key as keyof selectAccountData)}
            >
              <Checkbox checked={columnSettings[key]} />
              {columnAccountNames[key as keyof selectAccountData]}
            </MenuItem>
          ))}
      </Menu>
      <TableContainer component={Paper} sx={{ maxHeight: 620 }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length <
                          rows.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length <
                          rows.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length < rows.length
                      : false
                  }
                  checked={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length ===
                          rows.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length ===
                          rows.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length === rows.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {Object.keys(visibleColumns).map((key) => (
                <TableCell key={key}>
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      {columnAccountNames[key as keyof selectAccountData]}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handleRequestSort(key as keyof (typeof rows)[0])
                      }
                    >
                      {orderBy === key ? (
                        order[key] === "asc" ? (
                          <KeyboardArrowUpIcon />
                        ) : order[key] === "desc" ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <span>〇</span>
                        )
                      ) : (
                        <span>〇</span>
                      )}
                    </IconButton>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <AccountRow
                key={row.title}
                row={row}
                onSelect={handleSelect}
                isSelected={isSelected(row.id, row.completed)}
                visibleColumns={visibleColumns}
                onUpdate={updateAccount}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
