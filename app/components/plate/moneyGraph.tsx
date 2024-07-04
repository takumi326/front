"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { PieChart, Pie } from "recharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarApi, EventClickArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { classificationDelete } from "@/lib/api/classification-api";

import { PaymentShow } from "@/components/money/payment/show";
import { IncomeShow } from "@/components/money/income/show";
import { TransferShow } from "@/components/money/transfer/show";
import { ClassificationShow } from "@/components/money/classification/show";

import { paymentData } from "@/interface/payment-interface";
import { incomeData } from "@/interface/income-interface";
import { classificationData } from "@/interface/classification-interface";
// import { accountData } from "@/interface/account-interface";
import { transferData } from "@/interface/transfer-interface";

export const MoneyGraph = (): JSX.Element => {
  const {
    classifications,
    classificationMonthlyAmounts,
    accounts,
    allPayments,
    payments,
    calendarPayments,
    allIncomes,
    incomes,
    calendarIncomes,
    allTransfers,
    transfers,
    calendarTransfers,
    filter,
    setCurrentMonth,
    setLoading,
    setIsEditing,
  } = useContext(moneyContext);

  // let selectedEvent;

  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [sortedPaymentRows, setSortedPaymentRows] = useState<paymentData[]>([]);
  // const [sortedIncomeRows, setSortedIncomeRows] = useState<incomeData[]>([]);
  // const [sortedTransferRows, setSortedTransferRows] = useState<transferData[]>(
  //   []
  // );
  // const [sortedClassificationRows, setSortedClassificationRows] = useState<
  //   classificationData[]
  // >([]);
  // const [classificationMonth, setClassificationMonth] = useState("");

  // const calendarRef = useRef<FullCalendar>(null);

  // const handleDateChange = () => {
  //   if (calendarRef.current) {
  //     const calendarApi: CalendarApi = calendarRef.current.getApi();

  //     const currentDate = calendarApi.getDate();
  //     setCurrentMonth(
  //       `${currentDate.getFullYear()}${currentDate.getMonth() + 1}`
  //     );
  //   }
  // };

  // useEffect(() => {
  //   if (calendarRef.current) {
  //     const calendarApi = calendarRef.current.getApi();

  //     calendarApi.on("datesSet", handleDateChange);

  //     return () => {
  //       calendarApi.off("datesSet", handleDateChange);
  //     };
  //   }
  // }, []);

  // const getNextMonth = (yearMonth: string) => {
  //   const year = Number(yearMonth.slice(0, 4));
  //   const month = Number(yearMonth.slice(4));

  //   let nextYear = year;
  //   let nextMonth = month + 1;

  //   if (nextMonth > 12) {
  //     nextMonth = 1;
  //     nextYear += 1;
  //   }

  //   return String(nextYear) + String(nextMonth);
  // };

  // const date = (month: string, date: string) =>
  //   new Date(
  //     Number(month.slice(0, 4)),
  //     Number(month.slice(4)) - 1,
  //     Number(date),
  //     0,
  //     0
  //   );

  // const deleteClassification = async (id: string) => {
  //   setLoading(true);
  //   try {
  //     await classificationDelete(id);
  //     setIsEditing(true);
  //   } catch (error) {
  //     console.error("Failed to delete classification:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleEventClick = (clickInfo: EventClickArg) => {
  //   let data:
  //     | paymentData
  //     | incomeData
  //     | transferData
  //     | classificationData
  //     | undefined;

  //   if (clickInfo.event.extendedProps.paymentId) {
  //     const paymentId = clickInfo.event.extendedProps.paymentId;
  //     data = calendarPayments.find((payment) => payment.id === paymentId);
  //     if (data && payments) {
  //       const showPayment = allPayments.find(
  //         (showPayment) => showPayment.id === data!.id
  //       );
  //       if (showPayment) {
  //         selectedEvent = showPayment;
  //         setSortedPaymentRows([showPayment]);
  //         setSortedIncomeRows([]);
  //         setSortedTransferRows([]);
  //         setSortedClassificationRows([]);
  //       }
  //     }
  //   } else if (clickInfo.event.extendedProps.incomeId) {
  //     const incomeId = clickInfo.event.extendedProps.incomeId;
  //     data = calendarIncomes.find((income) => income.id === incomeId);
  //     if (data && incomes) {
  //       const showIncome = allIncomes.find(
  //         (showIncome) => showIncome.id === data!.id
  //       );
  //       if (showIncome) {
  //         selectedEvent = showIncome;
  //         setSortedPaymentRows([]);
  //         setSortedIncomeRows([showIncome]);
  //         setSortedTransferRows([]);
  //         setSortedClassificationRows([]);
  //       }
  //     }
  //   } else if (clickInfo.event.extendedProps.transferId) {
  //     const transferId = clickInfo.event.extendedProps.transferId;
  //     data = calendarTransfers.find((transfer) => transfer.id === transferId);
  //     if (data && transfers) {
  //       const showTransfer = allTransfers.find(
  //         (showTransfer) => showTransfer.id === data!.id
  //       );
  //       if (showTransfer) {
  //         selectedEvent = showTransfer;
  //         setSortedPaymentRows([]);
  //         setSortedIncomeRows([]);
  //         setSortedTransferRows([showTransfer]);
  //         setSortedClassificationRows([]);
  //       }
  //     }
  //   } else {
  //     const classificationId = clickInfo.event.extendedProps.classificationId;
  //     data = classifications.find(
  //       (classification) => classification.id === classificationId
  //     );
  //     if (data && classifications) {
  //       const showClassification = classifications.find(
  //         (showClassification) => showClassification.id === data!.id
  //       );
  //       if (showClassification) {
  //         selectedEvent = showClassification;
  //         setSortedPaymentRows([]);
  //         setSortedIncomeRows([]);
  //         setSortedTransferRows([]);
  //         setSortedClassificationRows([showClassification]);
  //         setClassificationMonth(
  //           clickInfo.event.extendedProps.classificationMonth
  //         );
  //       }
  //     }
  //   }

  //   setIsEditModalOpen(true);
  // };

  // const handleEditCloseModal = () => {
  //   setIsEditModalOpen(false);
  // };

  // const handleTodayClick = () => {
  //   if (calendarRef.current) {
  //     const calendarApi = calendarRef.current.getApi();
  //     calendarApi.today();
  //   }
  // };

  // const historyEvents =
  //   filter === "payment"
  //     ? calendarPayments.map((payment) => ({
  //         paymentId: payment.id,
  //         title: payment.category_name,
  //         start: payment.schedule,
  //         allDay: true,
  //         backgroundColor: "green",
  //         borderColor: "green",
  //       }))
  //     : filter === "income"
  //     ? calendarIncomes.map((income) => ({
  //         incomeId: income.id,
  //         title: income.category_name,
  //         start: income.schedule,
  //         allDay: true,
  //         backgroundColor: "green",
  //         borderColor: "green",
  //       }))
  //     : calendarTransfers.map((transfer) => ({
  //         transferId: transfer.id,
  //         title:
  //           // accounts.filter(
  //           //   (account) => account.id === transfer.before_account_id
  //           // )[0].name +
  //           // "→" +
  //           transfer.after_account_name,
  //         start: transfer.schedule,
  //         allDay: true,
  //         backgroundColor: "green",
  //         borderColor: "green",
  //       }));

  // const events =
  //   filter === "payment"
  //     ? classifications
  //         .filter(
  //           (classification) => classification.classification_type === "payment"
  //         )
  //         .flatMap((classification) =>
  //           classificationMonthlyAmounts
  //             .filter(
  //               (classificationMonthlyAmount) =>
  //                 classificationMonthlyAmount.classification_id ===
  //                   classification.id &&
  //                 classificationMonthlyAmount.date != "-1"
  //             )
  //             .map((classificationMonthlyAmount) => ({
  //               classificationId: classification.id,
  //               classificationMonth: classificationMonthlyAmount.month,
  //               title:
  //                 classification.name +
  //                 " " +
  //                 classificationMonthlyAmount.month.slice(4) +
  //                 "月分",
  //               start: date(
  //                 getNextMonth(classificationMonthlyAmount.month),
  //                 classificationMonthlyAmount.date
  //               ),
  //               allDay: true,
  //               backgroundColor: "red",
  //               borderColor: "red",
  //             }))
  //         )
  //     : [];

  // const allEvents = [...historyEvents, ...events];

  // PieChart 用のサンプルデータ
  const pieData01 = [
    { name: "Category 1", value: 400 },
    { name: "Category 2", value: 300 },
    { name: "Category 3", value: 300 },
    { name: "Category 4", value: 200 },
  ];

  const pieData02 = [
    { name: "Type A1", value: 100 },
    { name: "Type A2", value: 300 },
    { name: "Type B1", value: 100 },
    { name: "Type B2", value: 80 },
    { name: "Type B3", value: 40 },
    { name: "Type B4", value: 30 },
    { name: "Type B5", value: 50 },
    { name: "Type C1", value: 100 },
    { name: "Type C2", value: 200 },
    { name: "Type D1", value: 150 },
    { name: "Type D2", value: 50 },
  ];
  return (
    <>
      <PieChart width={400} height={400}>
        <Pie
          data={pieData02}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#82ca9d"
          label
        />
      </PieChart>
    </>
  );
};
