"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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

export const MoneyCalendar = (): JSX.Element => {
  const {
    classifications,
    classificationMonthlyAmounts,
    accounts,
    payments,
    calendarPayments,
    incomes,
    calendarIncomes,
    transfers,
    calendarTransfers,
    filter,
    setCurrentMonth,
    setLoading,
    setIsEditing,
  } = useContext(moneyContext);

  let selectedEvent;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortedPaymentRows, setSortedPaymentRows] = useState<paymentData[]>([]);
  const [sortedIncomeRows, setSortedIncomeRows] = useState<incomeData[]>([]);
  const [sortedTransferRows, setSortedTransferRows] = useState<transferData[]>(
    []
  );
  const [sortedClassificationRows, setSortedClassificationRows] = useState<
    classificationData[]
  >([]);

  const calendarRef = useRef(null);

  const handleDateChange = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      const currentDate = calendarApi.getDate();
      setCurrentMonth(
        `${currentDate.getFullYear()}${currentDate.getMonth() + 1}`
      );
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.on("datesSet", handleDateChange);

      return () => {
        calendarApi.off("datesSet", handleDateChange);
      };
    }
  }, []);

  const date = (month: string, date: string) =>
    new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(4)),
      Number(date),
      0,
      0
    );

  const deleteClassification = async (id: string) => {
    setLoading(true);
    try {
      await classificationDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete classification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    let data:
      | paymentData
      | incomeData
      | transferData
      | classificationData
      | undefined;

    console.log(clickInfo.event.extendedProps);
    if (clickInfo.event.extendedProps.paymentId) {
      data = calendarPayments.filter(
        (payment) => payment.id === clickInfo.event.extendedProps.paymentId
      )[0];
      if (data !== undefined) {
        if (payments) {
          const showPayment = payments.filter(
            (showPayment: paymentData) => showPayment.id === data.id
          )[0];
          selectedEvent = showPayment;
          setSortedPaymentRows([showPayment]);
          setSortedIncomeRows([]);
          setSortedTransferRows([]);
          setSortedClassificationRows([]);
        }
      }
    } else if (clickInfo.event.extendedProps.incomeId) {
      data = calendarIncomes.filter(
        (income) => income.id === clickInfo.event.extendedProps.incomeId
      )[0];
      if (data !== undefined) {
        if (incomes) {
          const showIncome = incomes.filter(
            (showIncome: incomeData) => showIncome.id === data.id
          )[0];
          selectedEvent = showIncome;
          console.log(showIncome);
          console.log(sortedPaymentRows);
          console.log(sortedIncomeRows);
          console.log(sortedTransferRows);
          console.log(sortedClassificationRows);
          setSortedPaymentRows([]);
          setSortedIncomeRows([showIncome]);
          setSortedTransferRows([]);
          setSortedClassificationRows([]);
        }
      }
    } else if (clickInfo.event.extendedProps.transferId) {
      data = calendarTransfers.filter(
        (transfer) => transfer.id === clickInfo.event.extendedProps.transferId
      )[0];
      if (data !== undefined) {
        if (transfers) {
          const showTransfer = transfers.filter(
            (showTransfer: transferData) => showTransfer.id === data.id
          )[0];
          selectedEvent = showTransfer;
          setSortedPaymentRows([]);
          setSortedIncomeRows([]);
          setSortedTransferRows([showTransfer]);
          setSortedClassificationRows([]);
        }
      }
    } else {
      data = classifications.filter(
        (classification) =>
          classification.id === clickInfo.event.extendedProps.classificationId
      )[0];
      if (data !== undefined) {
        if (classifications) {
          const showClassification = classifications.filter(
            (showClassification: classificationData) =>
              showClassification.id === data.id
          )[0];
          selectedEvent = showClassification;
          setSortedPaymentRows([]);
          setSortedIncomeRows([]);
          setSortedTransferRows([]);
          setSortedClassificationRows([showClassification]);
        }
      }
    }

    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const historyEvents =
    filter === "payment"
      ? calendarPayments.map((payment) => ({
          paymentId: payment.id,
          title: payment.category_name,
          start: payment.schedule,
          allDay: payment.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : filter === "income"
      ? calendarIncomes.map((income) => ({
          incomeId: income.id,
          title: income.category_name,
          start: income.schedule,
          allDay: income.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : calendarTransfers.map((transfer) => ({
          transferId: transfer.id,
          title:
            accounts.filter(
              (account) => account.id === transfer.before_account_id
            )[0].name +
            "→" +
            transfer.after_account_name,
          start: transfer.schedule,
          allDay: transfer.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }));

  const events =
    filter === "payment"
      ? classifications
          .filter(
            (classification) => classification.classification_type === "payment"
          )
          .flatMap((classification) =>
            classificationMonthlyAmounts
              .filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                    classification.id && classificationMonthlyAmount.date != "0"
              )
              .map((classificationMonthlyAmount) => ({
                classificationId: classification.id,
                title: classification.name + "(支払日)",
                start: date(
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date
                ),
                allDay: date(
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date
                ),
                backgroundColor: "red",
                borderColor: "red",
              }))
          )
      : filter === "income"
      ? classifications
          .filter(
            (classification) => classification.classification_type === "income"
          )
          .flatMap((classification) =>
            classificationMonthlyAmounts
              .filter(
                (classificationMonthlyAmount) =>
                  classificationMonthlyAmount.classification_id ===
                    classification.id && classificationMonthlyAmount.date != "0"
              )
              .map((classificationMonthlyAmount) => ({
                classificationId: classification.id,
                title: classification.name + "(給料日)",
                start: date(
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date
                ),
                allDay: date(
                  classificationMonthlyAmount.month,
                  classificationMonthlyAmount.date
                ),
                backgroundColor: "red",
                borderColor: "red",
              }))
          )
      : [];

  const allEvents = [...historyEvents, ...events];

  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleEditCloseModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            {sortedPaymentRows.length > 0 ? (
              <PaymentShow
                id={sortedPaymentRows[0].id}
                category_id={sortedPaymentRows[0].category_id}
                classification_id={sortedPaymentRows[0].classification_id}
                amount={sortedPaymentRows[0].amount}
                schedule={sortedPaymentRows[0].schedule}
                end_date={sortedPaymentRows[0].end_date}
                repetition={sortedPaymentRows[0].repetition}
                repetition_type={sortedPaymentRows[0].repetition_type}
                repetition_settings={sortedPaymentRows[0].repetition_settings}
                body={sortedPaymentRows[0].body}
                onClose={handleEditCloseModal}
              />
            ) : sortedIncomeRows.length > 0 ? (
              <IncomeShow
                id={sortedIncomeRows[0].id}
                category_id={sortedIncomeRows[0].category_id}
                classification_id={sortedIncomeRows[0].classification_id}
                amount={sortedIncomeRows[0].amount}
                schedule={sortedIncomeRows[0].schedule}
                end_date={sortedIncomeRows[0].end_date}
                repetition={sortedIncomeRows[0].repetition}
                repetition_type={sortedIncomeRows[0].repetition_type}
                repetition_settings={sortedIncomeRows[0].repetition_settings}
                body={sortedIncomeRows[0].body}
                onClose={handleEditCloseModal}
              />
            ) : sortedTransferRows.length > 0 ? (
              <TransferShow
                id={sortedTransferRows[0].id}
                before_account_id={sortedTransferRows[0].before_account_id}
                after_account_id={sortedTransferRows[0].after_account_id}
                amount={sortedTransferRows[0].amount}
                schedule={sortedTransferRows[0].schedule}
                end_date={sortedTransferRows[0].end_date}
                repetition={sortedTransferRows[0].repetition}
                repetition_type={sortedTransferRows[0].repetition_type}
                repetition_settings={sortedTransferRows[0].repetition_settings}
                body={sortedTransferRows[0].body}
                onClose={handleEditCloseModal}
              />
            ) : sortedClassificationRows.length > 0 ? (
              <ClassificationShow
                id={sortedClassificationRows[0].id}
                account_id={sortedClassificationRows[0].account_id}
                name={sortedClassificationRows[0].name}
                classification_type={filter}
                onClose={handleEditCloseModal}
                onDelete={deleteClassification}
              />
            ) : null}
          </div>
        </div>
      )}

      <div className="pb-14">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale="ja"
          height={437}
          events={allEvents}
          businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
          dayCellContent={(e) => e.dayNumberText.replace("日", "")}
          headerToolbar={{
            start: "prevYear,nextYear",
            center: "title",
            end: "today prev,next",
          }}
          eventClick={handleEventClick}
          eventClassNames="cursor-pointer"
        />
      </div>
    </>
  );
};
