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
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import {
  repetitionMoneyGetData,
  repetitionMoneyDelete,
} from "@/lib/api/repetitionMoney-api";
import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

import { paymentGetData } from "@/lib/api/payment-api";
import {
  paymentData,
  classificationNilPaymentData,
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
  classificationNilIncomeData,
  displayIncomeData,
  selectIncomeData,
} from "@/interface/income-interface";
import { IncomeRow } from "@/components/money/income/row";
import { IncomeNew } from "@/components/money/income/new";

import { accountGetData, accountDelete } from "@/lib/api/account-api";
import {
  accountData,
  columnAccountNames,
  displayAccountData,
  selectAccountData,
} from "@/interface/account-interface";
import { AccountRow } from "@/components/money/account/row";
import { AccountNew } from "@/components/money/account/new";

import { transferGetData } from "@/lib/api/transfer-api";
import { transferData } from "@/interface/transfer-interface";
import { TransferNew } from "@/components/money/transfer/new";

import { categoryGetData, categoryDelete } from "@/lib/api/category-api";
import { categoryData } from "@/interface/category-interface";
import { CategoryRow } from "@/components/money/category/row";
import { CategoryNew } from "@/components/money/category/new";

import { classificationGetData } from "@/lib/api/classification-api";
import {
  classificationData,
  classificationMonthlyAmountData,
} from "@/interface/classification-interface";
import { ClassificationNew } from "@/components/money/classification/new";

import { classificationMonthlyAmountGetData } from "@/lib/api/classificationMonthlyAmount-api";

export const MoneyTable: React.FC = () => {
  const {
    repetitionMoneies,
    setRepetitionMoneies,
    classifications,
    setClassifications,
    classificationMonthlyAmounts,
    setClassificationMonthlyAmounts,
    categories,
    setCategories,
    setCalendarPayments,
    payments,
    setPayments,
    setCalendarIncomes,
    incomes,
    setIncomes,
    accounts,
    setAccounts,
    setCalendarTransfers,
    transfers,
    setTransfers,
    filter,
    setFilter,
    currentMonth,
    isEditing,
    setIsEditing,
  } = useContext(moneyContext);

  const [rows, setRows] = useState<
    displayPaymentData[] | displayIncomeData[] | displayAccountData[]
  >([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isClassificationModalOpen, setIsClassificationModalOpen] =
    useState(false);
  const [isCategoryRowModalOpen, setIsCategoryRowModalOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  const [start, setStart] = useState<Date>(
    new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)) - 1,
      1
    )
  );
  const [end, setEnd] = useState<Date>(
    new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)),
      0,
      23,
      59
    )
  );

  const [orderBy, setOrderBy] = useState<keyof (typeof rows)[0]>("id");

  const [order, setOrder] = useState<{
    [key: string]: "asc" | "desc" | "default";
  }>({
    classification_name: "asc",
    classification_amount: "default",
    classification_account_name: "default",
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
        clsasfication_account_name: true,
      };
    }
  });

  useEffect(() => {
    const startScedule = new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)) - 1,
      1,
      0,
      0,
      0
    );
    const endScedule = new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)),
      0,
      23,
      59,
      59
    );
    setStart(startScedule);
    setEnd(endScedule);
  }, [currentMonth]);

  useEffect(() => {
    const handleAllDataFetch = async () => {
      await paymentGetData().then((paymentDatas: paymentData[]) => {
        const allPayments: Array<paymentData> = [];
        repetitionMoneyGetData().then(
          (repetitionMoneies: repetitionMoneyData[]) => {
            paymentDatas.forEach((paymentData: paymentData) => {
              if (paymentData.repetition === true) {
                repetitionMoneies
                  .filter(
                    (repetitionMoney: repetitionMoneyData) =>
                      repetitionMoney.payment_id === paymentData.id
                  )
                  .forEach((repetitionMoney: repetitionMoneyData) => {
                    const repetitionMoneyData = {
                      id: paymentData.id,
                      category_id: paymentData.category_id,
                      category_name: paymentData.category_name,
                      classification_id: paymentData.classification_id,
                      classification_name: paymentData.classification_name,
                      amount: paymentData.amount,
                      schedule: repetitionMoney.repetition_schedule,
                      end_date: paymentData.end_date,
                      repetition: paymentData.repetition,
                      repetition_type: paymentData.repetition_type,
                      repetition_settings: paymentData.repetition_settings,
                      body: paymentData.body,
                    };
                    allPayments.push(repetitionMoneyData);
                  });
              } else {
                allPayments.push(paymentData);
              }
            });
            setCalendarPayments(allPayments);
            repetitionMoneies;
          }
        );
      });

      paymentGetData().then((payments: paymentData[]) => {
        if (start !== undefined && end !== undefined) {
          const noRepetitonPayments = payments.filter(
            (payment: paymentData) =>
              payment.repetition === false &&
              new Date(payment.schedule).getTime() >= start.getTime() &&
              new Date(payment.schedule).getTime() <= end.getTime()
          );
          const repetitonPayments = payments.filter(
            (payment: paymentData) =>
              payment.repetition === true &&
              !(
                new Date(payment.end_date).getTime() <= start.getTime() ||
                new Date(payment.schedule).getTime() >= end.getTime()
              )
          );
          setPayments(() => [...noRepetitonPayments, ...repetitonPayments]);
        } else {
          setPayments(payments);
        }
      });

      await incomeGetData().then((incomeDatas: incomeData[]) => {
        const allIncomes: Array<incomeData> = [];
        repetitionMoneyGetData().then(
          (repetitionMoneies: repetitionMoneyData[]) => {
            incomeDatas.forEach((incomeData: incomeData) => {
              if (incomeData.repetition === true) {
                repetitionMoneies
                  .filter(
                    (repetitionMoney: repetitionMoneyData) =>
                      repetitionMoney.income_id === incomeData.id
                  )
                  .forEach((repetitionMoney: repetitionMoneyData) => {
                    const repetitionMoneyData = {
                      id: incomeData.id,
                      category_id: incomeData.category_id,
                      category_name: incomeData.category_name,
                      classification_id: incomeData.classification_id,
                      classification_name: incomeData.classification_name,
                      amount: incomeData.amount,
                      schedule: repetitionMoney.repetition_schedule,
                      end_date: incomeData.end_date,
                      repetition: incomeData.repetition,
                      repetition_type: incomeData.repetition_type,
                      repetition_settings: incomeData.repetition_settings,
                      body: incomeData.body,
                    };
                    allIncomes.push(repetitionMoneyData);
                  });
              } else {
                allIncomes.push(incomeData);
              }
            });
            setCalendarIncomes(allIncomes);
            repetitionMoneies;
          }
        );
      });
      await incomeGetData().then((incomes: incomeData[]) => {
        if (start !== undefined && end !== undefined) {
          const noRepetitonIncomes = incomes.filter(
            (income: incomeData) =>
              income.repetition === false &&
              new Date(income.schedule).getTime() >= start.getTime() &&
              new Date(income.schedule).getTime() <= end.getTime()
          );
          const repetitonIncomes = incomes.filter(
            (income: incomeData) =>
              income.repetition === true &&
              (new Date(income.schedule).getTime() >= start.getTime() ||
                new Date(income.end_date).getTime() <= end.getTime())
          );
          setIncomes(() => [...noRepetitonIncomes, ...repetitonIncomes]);
        } else {
          setIncomes(incomes);
        }
      });

      await accountGetData().then((accounts: accountData[]) => {
        setAccounts(accounts);
      });

      await categoryGetData().then((categories: categoryData[]) => {
        setCategories(categories);
      });

      await classificationGetData().then(
        (classifications: classificationData[]) => {
          setClassifications(classifications);
        }
      );

      await classificationMonthlyAmountGetData().then(
        (classificationMonthlyAmounts: classificationMonthlyAmountData[]) => {
          setClassificationMonthlyAmounts(classificationMonthlyAmounts);
        }
      );

      await transferGetData().then((transfers: transferData[]) => {
        setCalendarTransfers(transfers);
      });

      await transferGetData().then((transfers: transferData[]) => {
        if (start !== undefined && end !== undefined) {
          transfers
            .filter(
              (transfer: transferData) =>
                new Date(transfer.schedule).getTime() >= start.getTime() &&
                new Date(transfer.schedule).getTime() <= end.getTime()
            )
            .map((transfer: transferData) => {
              setTransfers((prevTransfers) => [...prevTransfers, transfer]);
            });
        } else {
          setTransfers(transfers);
        }
      });

      await repetitionMoneyGetData().then(
        (repetitionMoneies: repetitionMoneyData[]) => {
          setRepetitionMoneies(repetitionMoneies);
        }
      );
    };

    handleAllDataFetch();
  }, [start, isEditing]);

  useEffect(() => {
    let initialColumnSettings: { [key: string]: boolean } = {};
    let updateRows:
      | displayPaymentData[]
      | displayIncomeData[]
      | displayAccountData[];
    let classificationNilDatas:
      | classificationNilPaymentData[]
      | classificationNilIncomeData[];
    let allRows:
      | displayPaymentData[]
      | displayIncomeData[]
      | displayAccountData[];
    let updateOrder = {};

    if (filter === "payment") {
      initialColumnSettings = {
        classification_name: true,
        classification_amount: true,
        classification_account_name: true,
      };
      updateRows = classifications
        .filter(
          (classification) => classification.classification_type === "payment"
        )
        .map((classification) => ({
          id: classification.id,
          classification_account_id: classification.account_id,
          classification_account_name: classification.account_name,
          classification_name: classification.name,
          classification_date: classification.date,
          classification_classification_type:
            classification.classification_type,
          history: payments
            .filter(
              (payment) => payment.classification_id === classification.id
            )
            .map((payment) => ({
              payment_id: payment.id,
              payment_category_id: payment.category_id,
              payment_category_name: payment.category_name,
              payment_classification_id: payment.classification_id,
              payment_classification_name: payment.classification_name,
              payment_amount: payment.amount,
              payment_schedule: payment.schedule,
              payment_end_date: payment.end_date,
              payment_repetition: payment.repetition,
              payment_repetition_type: payment.repetition_type,
              payment_repetition_settings: payment.repetition_settings,
              payment_body: payment.body,
            })),
        }));
      classificationNilDatas = payments
        .filter((payment) => payment.classification_id === null)
        .map((payment) => ({
          payment_id: payment.id,
          payment_category_id: payment.category_id,
          payment_category_name: payment.category_name,
          payment_classification_id: payment.classification_id,
          payment_classification_name: payment.classification_name,
          payment_amount: payment.amount,
          payment_schedule: payment.schedule,
          payment_end_date: payment.end_date,
          payment_repetition: payment.repetition,
          payment_repetition_type: payment.repetition_type,
          payment_repetition_settings: payment.repetition_settings,
          payment_body: payment.body,
        }));
      allRows = [
        ...updateRows,
        {
          id: "",
          classification_account_id: "",
          classification_account_name: "",
          classification_name: "分類なし",
          classification_date: "",
          classification_classification_type: "payment",
          history: classificationNilDatas,
        },
      ];
      updateOrder = {
        classification_name: "asc",
        classification_amount: "default",
        classification_account_name: "default",
      };
    } else if (filter === "income") {
      initialColumnSettings = {
        classification_name: true,
        classification_amount: true,
        classification_account_name: true,
      };
      updateRows = classifications
        .filter(
          (classification) => classification.classification_type === "income"
        )
        .map((classification) => ({
          id: classification.id,
          classification_account_id: classification.account_id,
          classification_account_name: classification.account_name,
          classification_name: classification.name,
          classification_date: classification.date,
          classification_classification_type:
            classification.classification_type,
          history: incomes
            .filter((income) => income.classification_id === classification.id)
            .map((income) => ({
              income_id: income.id,
              income_category_id: income.category_id,
              income_category_name: income.category_name,
              income_classification_id: income.classification_id,
              income_classification_name: income.classification_name,
              income_amount: income.amount,
              income_schedule: income.schedule,
              income_end_date: income.end_date,
              income_repetition: income.repetition,
              income_repetition_type: income.repetition_type,
              income_repetition_settings: income.repetition_settings,
              income_body: income.body,
            })),
        }));
      classificationNilDatas = incomes
        .filter((income) => income.classification_id === null)
        .map((income) => ({
          income_id: income.id,
          income_category_id: income.category_id,
          income_category_name: income.category_name,
          income_classification_id: income.classification_id,
          income_classification_name: income.classification_name,
          income_amount: income.amount,
          income_schedule: income.schedule,
          income_end_date: income.end_date,
          income_repetition: income.repetition,
          income_repetition_type: income.repetition_type,
          income_repetition_settings: income.repetition_settings,
          income_body: income.body,
        }));
      allRows = [
        ...updateRows,
        {
          id: "",
          classification_account_id: "",
          classification_account_name: "",
          classification_name: "分類なし",
          classification_date: "",
          classification_classification_type: "income",
          history: classificationNilDatas,
        },
      ];
      updateOrder = {
        classification_name: "asc",
        classification_amount: "default",
        classification_account_name: "default",
      };
    } else {
      initialColumnSettings = {
        account_name: true,
        account_amount: true,
      };
      allRows = accounts.map((account) => ({
        id: account.id,
        account_name: account.name,
        account_amount: account.amount,
        account_body: account.body,
        history: transfers
          .filter((transfer) => transfer.before_account_id === account.id)
          .map((transfer) => ({
            transfer_id: transfer.id,
            transfer_before_account_id: transfer.before_account_id,
            transfer_after_account_id: transfer.after_account_id,
            transfer_after_account_name: transfer.after_account_name,
            transfer_amount: transfer.amount,
            transfer_schedule: transfer.schedule,
            transfer_end_date: transfer.end_date,
            transfer_repetition: transfer.repetition,
            transfer_repetition_type: transfer.repetition_type,
            transfer_repetition_settings: transfer.repetition_settings,
            transfer_body: transfer.body,
          })),
      }));
      updateOrder = { account_name: "asc", account_amount: "default" };
    }
    setColumnSettings(initialColumnSettings);
    setRows(allRows);
    setOrder(updateOrder);
    setIsEditing(false);
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

  const handleOpenNewClassificationModal = () => {
    setIsClassificationModalOpen(true);
  };

  const handleCloseNewClassificationModal = () => {
    setIsClassificationModalOpen(false);
  };

  const handleOpenCategoryRowModal = () => {
    setIsCategoryRowModalOpen(true);
  };

  const handleCloseCategoryRowModal = () => {
    setIsCategoryRowModalOpen(false);
  };

  const handleOpenNewCategoryModal = () => {
    setIsNewCategoryModalOpen(true);
  };

  const handleCloseNewCategoryModal = () => {
    setIsNewCategoryModalOpen(false);
  };

  // const newPayment = (newData: paymentData) => {
  //   setPayments([...payments, newData]);
  //   setIsAdding(true);
  // };

  // const newIncome = (newData: incomeData) => {
  //   setIncomes([...incomes, newData]);
  //   setIsAdding(true);
  // };

  // const newClassification = (newData: classificationData) => {
  //   setClassifications([...classifications, newData]);
  //   setIsAdding(true);
  // };

  // const newCategory = (newData: categoryData) => {
  //   setCategories([...categories, newData]);
  //   setIsAdding(true);
  // };

  // const newAccount = (newData: accountData) => {
  //   setAccounts([...accounts, newData]);
  //   setIsAdding(true);
  // };

  // const newTransfer = (newData: transferData) => {
  //   // setTransfers([...transfers, newData]);
  //   setIsAdding(true);
  // };

  // const updatePayment = (updatePayment: paymentData) => {
  //   const updatedPayments = payments.map((payment) => {
  //     if (payment.id === updatePayment.id) {
  //       return updatePayment;
  //     }
  //     return payment;
  //   });
  //   setPayments(updatedPayments);
  //   setIsEditing(true);
  // };

  // const updateIncome = (updateIncome: incomeData) => {
  //   const updatedIncomes = incomes.map((income) => {
  //     if (income.id === updateIncome.id) {
  //       return updateIncome;
  //     }
  //     return income;
  //   });
  //   setIncomes(updatedIncomes);
  //   setIsEditing(true);
  // };

  // const updateAccount = (updateAccount: accountData) => {
  //   const updatedAccounts = accounts.map((account) => {
  //     if (account.id === updateAccount.id) {
  //       return updateAccount;
  //     }
  //     return account;
  //   });
  //   setAccounts(updatedAccounts);
  //   setIsEditing(true);
  // };

  // const updateTransfer = (updateTransfer: transferData) => {
  //   // const updatedTransfers = transfers.map((transfer) => {
  //   //   if (transfer.id === updateTransfer.id) {
  //   //     return updateTransfer;
  //   //   }
  //   //   return transfer;
  //   // });
  //   // setTransfers(updatedTransfers);
  //   setIsEditing(true);
  // };

  // const updateClassification = () => {
  //   // const updatedTransfers = transfers.map((transfer) => {
  //   //   if (transfer.id === updateTransfer.id) {
  //   //     return updateTransfer;
  //   //   }
  //   //   return transfer;
  //   // });
  //   // setTransfers(updatedTransfers);
  //   setIsEditing(true);
  // };

  // const updateCategory = () => {
  //   // const updatedTransfers = transfers.map((transfer) => {
  //   //   if (transfer.id === updateTransfer.id) {
  //   //     return updateTransfer;
  //   //   }
  //   //   return transfer;
  //   // });
  //   // setTransfers(updatedTransfers);
  //   setIsEditing(true);
  // };

  const deleteData = async (id: string) => {
    try {
      await incomeDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete income:", error);
    }

    try {
      await accountDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete category :", error);
    }
  };

  // const deleteAllData = async (ids: string[]) => {
  //   if (filter === "payment") {
  //     try {
  //       await Promise.all(ids.map((id) => paymentDelete(id)));
  //       setPayments(payments.filter((payment) => !ids.includes(payment.id)));
  //     } catch (error) {
  //       console.error("Failed to delete payment:", error);
  //     }
  //   } else if (filter === "income") {
  //     try {
  //       await Promise.all(ids.map((id) => incomeDelete(id)));
  //       setIncomes(incomes.filter((income) => !ids.includes(income.id)));
  //     } catch (error) {
  //       console.error("Failed to delete income:", error);
  //     }
  //   } else {
  //     try {
  //       await Promise.all(ids.map((id) => accountDelete(id)));
  //       setAccounts(accounts.filter((account) => !ids.includes(account.id)));
  //     } catch (error) {
  //       console.error("Failed to delete todo:", error);
  //     }
  //   }
  // };

  // const handleAllDelete = () => {
  //   deleteAllData(selected);
  //   setSelected([]);
  // };

  const handleRequestSort = (property: keyof (typeof rows)[0]) => {
    let newOrder: "asc" | "desc" | "default" = "asc";
    if (orderBy === property) {
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

  // const unclassifiedRow = sortedRows.filter(
  //   (row) => row.classification_name === "分類なし" && row.history.length > 0
  // );

  const sortedPayemntRows = [
    ...sortedRows.filter(
      (row): row is displayPaymentData =>
        "classification_name" in row && row.classification_name !== "分類なし"
    ),
    ...sortedRows.filter(
      (row): row is displayPaymentData =>
        "classification_name" in row &&
        row.classification_name === "分類なし" &&
        row.history.length > 0
    ),
  ];

  const sortedIncomeRows = [
    ...sortedRows.filter(
      (row): row is displayIncomeData =>
        "classification_name" in row && row.classification_name !== "分類なし"
    ),
    ...sortedRows.filter(
      (row): row is displayIncomeData =>
        "classification_name" in row &&
        row.classification_name === "分類なし" &&
        row.history.length > 0
    ),
  ];

  const sortedAccountRows = [
    ...sortedRows.filter(
      (row): row is displayAccountData => "account_name" in row
    ),
  ];

  // const handleAllSelect = () => {
  //   if (filter === "payment") {
  //     if (selected.length === rows.length) {
  //       setSelected([]);
  //     } else {
  //       const allIds = payments.map((payment) => payment.id);
  //       setSelected(allIds);
  //     }
  //   } else if (filter === "income") {
  //     if (selected.length === rows.length) {
  //       setSelected([]);
  //     } else {
  //       const allIds = incomes.map((income) => income.id);
  //       setSelected(allIds);
  //     }
  //   } else {
  //     if (selected.length === rows.length) {
  //       setSelected([]);
  //     } else {
  //       const allIds = accounts.map((account) => account.id);
  //       setSelected(allIds);
  //     }
  //   }
  // };

  // const handleSelect = (id: string) => {
  //   if (selected.includes(id)) {
  //     setSelected(selected.filter((item) => item !== id));
  //   } else {
  //     setSelected([...selected, id]);
  //   }
  // };

  // const isSelected = (id: string) => selected.includes(id);

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

  const calculateClassificationAllMoney = () => {
    let allMoney = 0;
    if (filter === "payment") {
      classifications
        .filter(
          (classification) => classification.classification_type === "payment"
        )
        .map((classification) => {
          const money = classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
                classification.id &&
              classificationMonthlyAmount.month === currentMonth
          )[0];
          allMoney += money && parseFloat(String(money.amount));
        });
    } else {
      classifications
        .filter(
          (classification) => classification.classification_type === "income"
        )
        .map((classification) => {
          const money = classificationMonthlyAmounts.filter(
            (classificationMonthlyAmount) =>
              classificationMonthlyAmount.classification_id ===
                classification.id &&
              classificationMonthlyAmount.month === currentMonth
          )[0];
          allMoney += money && parseFloat(String(money.amount));
        });
    }
    return allMoney;
  };

  const totalClassificationMoney = calculateClassificationAllMoney();

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
            <PaymentNew onClose={handleCloseNewModal} />
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
            <IncomeNew onClose={handleCloseNewModal} />
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
              <AccountNew onClose={handleCloseNewModal} />
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
            <TransferNew onClose={handleCloseNewTransferModal} />
          </div>
        </div>
      )}

      {isClassificationModalOpen &&
        (filter === "payment" || filter === "income") && (
          <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
            <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
              <button
                onClick={handleCloseNewClassificationModal}
                className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
              >
                <CloseIcon />
              </button>
              <ClassificationNew
                onClose={handleCloseNewClassificationModal}
                classification_type={filter}
              />
            </div>
          </div>
        )}

      {isCategoryRowModalOpen &&
        (filter === "payment" || filter === "income") && (
          <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
            <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
              <button
                onClick={handleCloseCategoryRowModal}
                className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
              >
                <CloseIcon />
              </button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOpenNewCategoryModal}
                sx={{ marginY: 5 }}
              >
                カテゴリ新規作成
              </Button>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 700, minWidth: 500 }}
              >
                <Table stickyHeader aria-label="collapsible table sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>カテゴリ名</TableCell>
                    </TableRow>
                  </TableHead>
                  {categories
                    .filter((category) => category.category_type === filter)
                    .map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        category_type={filter}
                      />
                    ))}
                </Table>
              </TableContainer>
            </div>
          </div>
        )}

      {isNewCategoryModalOpen &&
        (filter === "payment" || filter === "income") && (
          <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
            <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
              <button
                onClick={handleCloseNewCategoryModal}
                className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
              >
                <CloseIcon />
              </button>
              <CategoryNew
                onClose={handleCloseNewCategoryModal}
                category_type={filter}
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
          onClick={handleMenuClick}
        >
          <KeyboardArrowDownIcon />
        </Button>
        <div className="ml-auto">
          {filter === "account" ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenNewTransferModal}
            >
              自分口座への送金
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenCategoryRowModal}
              >
                カテゴリ一覧
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenNewClassificationModal}
              >
                分類作成
              </Button>
            </>
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
      <TableContainer component={Paper} sx={{ maxHeight: 605 }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filter === "payment"
              ? sortedPayemntRows.map((row) => (
                  <PaymentRow
                    key={row.id}
                    row={row}
                    start={start}
                    end={end}
                    visibleColumns={visibleColumns}
                  />
                ))
              : filter === "income"
              ? sortedIncomeRows.map((row) => (
                  <IncomeRow
                    key={row.id}
                    row={row}
                    visibleColumns={visibleColumns}
                  />
                ))
              : sortedAccountRows.map((row) => (
                  <AccountRow
                    key={row.id}
                    row={row}
                    visibleColumns={visibleColumns}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {filter === "payment" ? (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography>
                      {currentMonth.slice(4)}月分合計：{" "}
                      {formatAmountCommas(totalClassificationMoney)}
                    </Typography>
                  </TableCell>
                </>
              ) : filter === "income" ? (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography>
                      {currentMonth.slice(4)}月分合計：{" "}
                      {formatAmountCommas(totalClassificationMoney)}
                    </Typography>
                  </TableCell>
                </>
              ) : (
                <TableCell align="center">
                  <Typography>
                    合計金額： {formatAmountCommas(totalAccountMoney)}
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
