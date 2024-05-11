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

import { paymentGetData, paymentDelete } from "@/lib/api/payment-api";
import {
  paymentData,
  columnPaymentNames,
  displayPaymentData,
  selectPaymentData,
} from "@/interface/payment-interface";
import { PaymentRow } from "@/components/payment/row";
import { PaymentNew } from "@/components/payment/new";

import { incomeGetData, incomeDelete } from "@/lib/api/income-api";
import {
  incomeData,
  columnIncomeNames,
  displayIncomeData,
  selectIncomeData,
} from "@/interface/income-interface";
import { IncomeRow } from "@/components/income/row";
import { IncomeNew } from "@/components/income/new";

import { transferGetData, transferDelete } from "@/lib/api/transfer-api";
import {
  transferData,
  columnTransferNames,
  selectTransferData,
} from "@/interface/transfer-interface";
import { TransferRow } from "@/components/transfer/row";
import { TransferNew } from "@/components/transfer/new";

import { accountGetData, accountDelete } from "@/lib/api/account-api";
import {
  accountData,
  columnAccountNames,
  displayAccountData,
  selectAccountData,
} from "@/interface/account-interface";
import { AccountRow } from "@/components/account/row";
import { AccountNew } from "@/components/account/new";

import { categoryGetData, categoryDelete } from "@/lib/api/category-api";
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

  const [rows, setRows] = useState<
    displayPaymentData[] | displayIncomeData[] | displayAccountData[]
  >([]);
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

  const [orderBy, setOrderBy] = useState<keyof (typeof rows)[0]>(() => {
    if (filter === "payment") {
      return "classification_name";
    } else if (filter === "income") {
      return "classification_name";
    } else {
      return "account_name";
    }
  });

  const [order, setOrder] = useState<{
    [key: string]: "asc" | "desc" | "default";
  }>({
    classification_name: "default",
    classification_amount: "default",
    classification_account: "default",
  });

  const [columnSettings, setColumnSettings] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (rows.length > 0) {
      const initialSettings: { [key: string]: boolean } = {};
      Object.keys(rows[0]).forEach((key) => {
        initialSettings[key] = true;
      });
      return initialSettings;
    } else {
      return {
        classification_name: true,
        classification_amount: true,
        clsasfication_account: true,
      };
    }
  });

  useEffect(() => {
    let initialColumnSettings: { [key: string]: boolean } = {};
    let updateRows:
      | displayPaymentData[]
      | displayIncomeData[]
      | displayAccountData[];
    let updateOrder = {};

    if (filter === "payment") {
      initialColumnSettings = {
        classification_name: true,
        classification_amount: true,
        clsasfication_account: true,
      };
      updateRows = classifications.map((cItem) => ({
        classification_name: cItem.name,
        classification_amount: cItem.amount,
        clsasfication_account: cItem.account_name,
        history: payments.map((pItem) => ({
          payment_schedule: pItem.schedule,
          payment_category_name: pItem.category_name,
          payment_amount: pItem.amount,
          payment_repetition_type: pItem.repetition_type,
        })),
      }));
      updateOrder = {
        classification_name: "default",
        classification_amount: "default",
        classification_account: "default",
      };
    } else if (filter === "income") {
      initialColumnSettings = {
        classification_name: true,
        classification_amount: true,
        clsasfication_account: true,
      };
      updateRows = classifications.map((cItem) => ({
        classification_name: cItem.name,
        classification_amount: cItem.amount,
        clsasfication_account: cItem.account_name,
        history: payments.map((iItem) => ({
          income_schedule: iItem.schedule,
          income_category_name: iItem.category_name,
          income_amount: iItem.amount,
          income_repetition_type: iItem.repetition_type,
        })),
      }));
      updateOrder = {
        classification_name: "default",
        classification_amount: "default",
        classification_account: "default",
      };
    } else {
      initialColumnSettings = {
        account_name: true,
        account_amount: true,
      };
      updateRows = accounts.map((aItem) => ({
        account_name: aItem.name,
        account_amount: aItem.amount,
        history: transfers.map((tItem) => ({
          transfer_schedule: tItem.schedule,
          transfer_before_account_name: tItem.before_account_name,
          transfer_amount: tItem.amount,
          transfer_repetition_type: tItem.repetition_type,
        })),
      }));
      updateOrder = { account_name: "default", account_amount: "default" };
    }

    setColumnSettings(initialColumnSettings);
    setRows(updateRows);
    setOrder(updateOrder);
  }, [filter]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    paymentGetData().then((data) => {
      setPayments(data);
    });
    incomeGetData().then((data) => {
      setIncomes(data);
    });
    accountGetData().then((data) => {
      setAccounts(data);
    });
    categoryGetData().then((data) => {
      setCategories(data);
    });
    classificationGetData().then((data) => {
      setClassifications(data);
    });
    transferGetData().then((data) => {
      setTransfers(data);
    });
  }, [isEditing, isAdding]);

  useEffect(() => {
    setIsEditing(false);
    setIsAdding(false);
  }, [payments, incomes, accounts, categories, classifications, transfers]);

  const handleFilterChange = (value: "payment" | "income" | "account") => {
    setFilter(value);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
  };

  const newPayment = (newData: paymentData) => {
    setPayments([...payments, newData]);
    setIsEditing(true);
  };

  const newIncome = (newData: incomeData) => {
    setIncomes([...incomes, newData]);
    setIsEditing(true);
  };

  const newAccount = (newData: accountData) => {
    setAccounts([...accounts, newData]);
    setIsEditing(true);
  };

  const updatePayment = (updatePayment: paymentData) => {
    const updatedPayments = payments.map((payment) => {
      if (payment.id === updatePayment.id) {
        return updatePayment;
      }
      return payment;
    });
    setPayments(updatedPayments);
    setIsAdding(true);
  };

  const updateIncome = (updateIncome: incomeData) => {
    const updatedIncomes = incomes.map((income) => {
      if (income.id === updateIncome.id) {
        return updateIncome;
      }
      return income;
    });
    setIncomes(updatedIncomes);
    setIsAdding(true);
  };

  const updateAccount = (updateAccount: accountData) => {
    const updatedAccounts = accounts.map((account) => {
      if (account.id === updateAccount.id) {
        return updateAccount;
      }
      return account;
    });
    setAccounts(updatedAccounts);
    setIsAdding(true);
  };

  const deleteAccount = async (id: string) => {
    try {
      await accountDelete(id);
      setAccounts(accounts.filter((account) => account.id !== id));
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
  const sortedRows = rows.slice().sort((a, b) => {
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
            <AccountNew onAdd={newData} onClose={handleNewCloseModal} />
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
