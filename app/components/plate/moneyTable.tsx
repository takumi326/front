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
  TableFooter,
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
import { PaymentRow } from "@/components/money/payment/row";
import { PaymentNew } from "@/components/money/payment/new";

import { incomeGetData, incomeDelete } from "@/lib/api/income-api";
import {
  incomeData,
  columnIncomeNames,
  displayIncomeData,
  selectIncomeData,
} from "@/interface/income-interface";
// import { IncomeRow } from "@/components/income/row";
// import { IncomeNew } from "@/components/income/new";

import { accountGetData, accountDelete } from "@/lib/api/account-api";
import { transferGetData, transferDelete } from "@/lib/api/transfer-api";
import {
  accountData,
  columnAccountNames,
  displayAccountData,
  selectAccountData,
  transferData,
} from "@/interface/account-interface";
import { AccountRow } from "@/components/money/account/row";
import { AccountNew } from "@/components/money/account/new";
import { TransferNew } from "@/components/money/transfer/new";

import { categoryGetData, categoryDelete } from "@/lib/api/category-api";
import {
  categoryData,
  // columnCategoryNames,
  // selectCategoryData,
} from "@/interface/category-interface";
// import { CategoryRow } from "@/components/category/row";
// import { CategoryNew } from "@/components/category/new";

import {
  classificationGetData,
  classificationDelete,
} from "@/lib/api/classification-api";
import {
  classificationData,
  columnClassificationNames,
  selectClassificationData,
} from "@/interface/classification-interface";
// import { ClassificationRow } from "@/components/classification/row";
// import { ClassificationNew } from "@/components/classification/new";

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
  // const [completedAccounts, setCompletedAccounts] = useState<accountData[]>([]);
  // const [incompleteAccounts, setIncompleteAccounts] = useState<accountData[]>(
  // []
  // );

  const [filter, setFilter] = useState<"payment" | "income" | "account">(
    "account"
  );

  // const [displayedAccounts, setDisplayedAccounts] = useState<accountData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  // const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  // const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

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
    paymentGetData().then((data) => {
      setPayments(data);
    });
    // incomeGetData().then((data) => {
    //   setIncomes(data);
    // });
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
        id: cItem.id,
        classification_account_id: cItem.account_id,
        clsasfication_account: cItem.account_name,
        classification_name: cItem.name,
        classification_amount: cItem.amount,
        history: payments
          .filter((pItem) => pItem.classification_id === cItem.id)
          .map((pItem) => ({
            payment_id: pItem.id,
            payment_category_id: pItem.category_id,
            payment_category_name: pItem.category_name,
            payment_classification_id: pItem.classification_id,
            payment_classification_name: pItem.classification_name,
            payment_amount: pItem.amount,
            payment_schedule: pItem.schedule,
            payment_repetition: pItem.repetition,
            payment_repetition_type: pItem.repetition_type,
            payment_repetition_settings: pItem.repetition_settings,
            payment_body: pItem.body,
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
        id: cItem.id,
        classification_account_id: cItem.account_id,
        clsasfication_account: cItem.account_name,
        classification_name: cItem.name,
        classification_amount: cItem.amount,
        history: payments
          .filter((iItem) => iItem.classification_id === cItem.id)
          .map((iItem) => ({
            income_id: iItem.id,
            income_category_id: iItem.category_id,
            income_category_name: iItem.category_name,
            income_classification_id: iItem.classification_id,
            income_classification_name: iItem.classification_name,
            income_amount: iItem.amount,
            income_schedule: iItem.schedule,
            income_repetition: iItem.repetition,
            income_repetition_type: iItem.repetition_type,
            income_repetition_settings: iItem.repetition_settings,
            income_body: iItem.body,
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
        id: aItem.id,
        account_name: aItem.name,
        account_amount: aItem.amount,
        account_body: aItem.body,
        history: transfers
          .filter((tItem) => tItem.before_account_id === aItem.id)
          .map((tItem) => ({
            transfer_id: tItem.id,
            transfer_before_account_id: tItem.before_account_id,
            transfer_after_account_id: tItem.after_account_id,
            transfer_after_account_name: tItem.after_account_name,
            transfer_amount: tItem.amount,
            transfer_schedule: tItem.schedule,
            transfer_repetition: tItem.repetition,
            transfer_repetition_type: tItem.repetition_type,
            transfer_repetition_settings: tItem.repetition_settings,
            transfer_body: tItem.body,
          })),
      }));
      updateOrder = { account_name: "asc", account_amount: "default" };
    }

    setColumnSettings(initialColumnSettings);
    setRows(updateRows);
    setOrder(updateOrder);
    setSelected([]);
  }, [
    filter,
    payments,
    incomes,
    accounts,
    categories,
    classifications,
    transfers,
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setIsEditing(false);
    setIsAdding(false);
  }, [payments, incomes, accounts, categories, classifications, transfers]);

  const handleFilterChange = (value: "payment" | "income" | "account") => {
    setFilter(value);
  };

  const handleOpenNewModal = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseNewModal = () => {
    setIsNewModalOpen(false);
  };

  const handleOpenNewTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const handleCloseNewTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const newPayment = (newData: paymentData) => {
    setPayments([...payments, newData]);
    setIsAdding(true);
  };

  const newIncome = (newData: incomeData) => {
    setIncomes([...incomes, newData]);
    setIsAdding(true);
  };

  const newClassification = (newData: classificationData) => {
    setClassifications([...classifications, newData]);
    setIsAdding(true);
  };

  const newCategory = (newData: categoryData) => {
    setCategories([...categories, newData]);
    setIsAdding(true);
  };

  const newAccount = (newData: accountData) => {
    setAccounts([...accounts, newData]);
    setIsAdding(true);
  };

  const newTransfer = (newData: transferData) => {
    // setTransfers([...transfers, newData]);
    setIsAdding(true);
  };

  const updatePayment = (updatePayment: paymentData) => {
    const updatedPayments = payments.map((payment) => {
      if (payment.id === updatePayment.id) {
        return updatePayment;
      }
      return payment;
    });
    setPayments(updatedPayments);
    setIsEditing(true);
  };

  const updateIncome = (updateIncome: incomeData) => {
    const updatedIncomes = incomes.map((income) => {
      if (income.id === updateIncome.id) {
        return updateIncome;
      }
      return income;
    });
    setIncomes(updatedIncomes);
    setIsEditing(true);
  };

  const updateAccount = (updateAccount: accountData) => {
    const updatedAccounts = accounts.map((account) => {
      if (account.id === updateAccount.id) {
        return updateAccount;
      }
      return account;
    });
    setAccounts(updatedAccounts);
    setIsEditing(true);
  };

  const updateTransfer = (updateTransfer: transferData) => {
    // const updatedTransfers = transfers.map((transfer) => {
    //   if (transfer.id === updateTransfer.id) {
    //     return updateTransfer;
    //   }
    //   return transfer;
    // });
    // setTransfers(updatedTransfers);
    setIsEditing(true);
  };

  const deleteData = async (id: string) => {
    if (filter === "payment") {
      try {
        await paymentDelete(id);
        setPayments(payments.filter((payment) => payment.id !== id));
      } catch (error) {
        console.error("Failed to delete payment:", error);
      }
    } else if (filter === "income") {
      try {
        await incomeDelete(id);
        setIncomes(incomes.filter((income) => income.id !== id));
      } catch (error) {
        console.error("Failed to delete income:", error);
      }
    } else {
      try {
        await accountDelete(id);
        setAccounts(accounts.filter((account) => account.id !== id));
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  const deleteTransfer = async (id: string) => {
    try {
      await transferDelete(id);
      // setTransfers(transfers.filter((transfer) => transfer.id !== id));
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete transfer:", error);
    }
  };

  const deleteAllData = async (ids: string[]) => {
    if (filter === "payment") {
      try {
        await Promise.all(ids.map((id) => paymentDelete(id)));
        setPayments(payments.filter((payment) => !ids.includes(payment.id)));
      } catch (error) {
        console.error("Failed to delete payment:", error);
      }
    } else if (filter === "income") {
      try {
        await Promise.all(ids.map((id) => incomeDelete(id)));
        setIncomes(incomes.filter((income) => !ids.includes(income.id)));
      } catch (error) {
        console.error("Failed to delete income:", error);
      }
    } else {
      try {
        await Promise.all(ids.map((id) => accountDelete(id)));
        setAccounts(accounts.filter((account) => !ids.includes(account.id)));
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  const handleAllDelete = () => {
    deleteAllData(selected);
    setSelected([]);
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

  const handleAllSelect = () => {
    if (filter === "payment") {
      if (selected.length === rows.length) {
        setSelected([]);
      } else {
        const allIds = payments.map((payment) => payment.id);
        setSelected(allIds);
      }
    } else if (filter === "income") {
      if (selected.length === rows.length) {
        setSelected([]);
      } else {
        const allIds = incomes.map((income) => income.id);
        setSelected(allIds);
      }
    } else {
      if (selected.length === rows.length) {
        setSelected([]);
      } else {
        const allIds = accounts.map((account) => account.id);
        setSelected(allIds);
      }
    }
  };

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const isSelected = (id: string) => selected.includes(id);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleColumnToggle = (
    property:
      | keyof selectPaymentData
      | keyof selectIncomeData
      | keyof selectAccountData
  ) => {
    setColumnSettings((prevSettings) => ({
      ...prevSettings,
      [property]: !prevSettings[property],
    }));
  };

  const visibleColumns = Object.fromEntries(
    Object.entries(columnSettings).filter(([key, value]) => value)
  );

  const formatAmountCommas = (number: number) => {
    const integerPart = Math.floor(number);
    const decimalPart = (number - integerPart).toFixed(0).slice(1);
    return (
      integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      decimalPart +
      "円"
    );
  };

  const calculateAccountAllMoney = () => {
    let allMoney = 0;
    accounts.map((account) => {
      allMoney += parseFloat(String(account.amount));
    });
    return allMoney;
  };

  const totalAccountMoney = calculateAccountAllMoney();

  return (
    <Box>
      {isNewModalOpen && filter === "payment" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseNewModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <PaymentNew
              onPaymentAdd={newPayment}
              onClassificationUpdate={newClassification}
              onCategoryUpdate={newCategory}
              onClose={handleCloseNewModal}
            />
          </div>
        </div>
      ) : isNewModalOpen && filter === "income" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseNewModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <AccountNew onAdd={newAccount} onClose={handleCloseNewModal} />
          </div>
        </div>
      ) : (
        isNewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
            <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
              <button
                onClick={handleCloseNewModal}
                className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
              >
                <CloseIcon />
              </button>
              <AccountNew onAdd={newAccount} onClose={handleCloseNewModal} />
            </div>
          </div>
        )
      )}

      {isTransferModalOpen && filter === "account" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseNewTransferModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <TransferNew
              onAccountUpdate={updateAccount}
              onTransferAdd={newTransfer}
              onClose={handleCloseNewTransferModal}
            />
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
            口座
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
        <div className="ml-auto">
          {filter === "account" && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenNewTransferModal}
            >
              自分口座への送金
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenNewModal}
          >
            新規作成
          </Button>
        </div>
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
          Object.keys(rows[0]).map((key) =>
            filter === "payment" ? (
              columnPaymentNames[key as keyof selectPaymentData] ? (
                <MenuItem
                  key={key}
                  onClick={() =>
                    handleColumnToggle(key as keyof selectPaymentData)
                  }
                >
                  <Checkbox checked={columnSettings[key]} />
                  {columnPaymentNames[key as keyof selectPaymentData]}
                </MenuItem>
              ) : null
            ) : filter === "income" ? (
              columnIncomeNames[key as keyof selectIncomeData] ? (
                <MenuItem
                  key={key}
                  onClick={() =>
                    handleColumnToggle(key as keyof selectIncomeData)
                  }
                >
                  <Checkbox checked={columnSettings[key]} />
                  {columnIncomeNames[key as keyof selectIncomeData]}
                </MenuItem>
              ) : null
            ) : columnAccountNames[key as keyof selectAccountData] ? (
              <MenuItem
                key={key}
                onClick={() =>
                  handleColumnToggle(key as keyof selectAccountData)
                }
              >
                <Checkbox checked={columnSettings[key]} />
                {columnAccountNames[key as keyof selectAccountData]}
              </MenuItem>
            ) : null
          )}
      </Menu>
      <TableContainer component={Paper} sx={{ maxHeight: 355 }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={
                    selected.length > 0 && selected.length === rows.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell> */}
              <TableCell />
              {Object.keys(visibleColumns).map((key) => (
                <TableCell key={key}>
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      {filter === "payment"
                        ? columnPaymentNames[key as keyof selectPaymentData]
                        : filter === "income"
                        ? columnIncomeNames[key as keyof selectIncomeData]
                        : columnAccountNames[key as keyof selectAccountData]}
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
            {filter === "payment"
              ? sortedRows.map((row) => (
                  <PaymentRow
                    key={row.id}
                    row={row}
                    // onSelect={handleSelect}
                    // isSelected={isSelected(row.id)}
                    visibleColumns={visibleColumns}
                    onPaymentUpdate={updateAccount}
                    // onTransferUpdate={updateTransfer}
                    onPaymnetDelete={deleteData}
                    // onTransferDelete={deleteTransfer}
                  />
                ))
              : filter === "income"
              ? sortedRows.map((row) => (
                  <AccountRow
                    key={row.id}
                    row={row}
                    onSelect={handleSelect}
                    isSelected={isSelected(row.id)}
                    visibleColumns={visibleColumns}
                    onUpdate={updateAccount}
                    onDelete={deleteData}
                  />
                ))
              : sortedRows.map((row) => (
                  <AccountRow
                    key={row.id}
                    row={row}
                    // onSelect={handleSelect}
                    // onAllSelect={handleAllSelect}
                    // isSelected={isSelected(row.history.transfer_id)}
                    visibleColumns={visibleColumns}
                    onAccountUpdate={updateAccount}
                    onTransferUpdate={updateTransfer}
                    onAccountDelete={deleteData}
                    onTransferDelete={deleteTransfer}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                {filter === "payment" ? (
                  <Typography>今月合計： 1</Typography>
                ) : filter === "income" ? (
                  <Typography>今月合計： 1</Typography>
                ) : (
                  <Typography>
                    合計金額： {formatAmountCommas(totalAccountMoney)}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
