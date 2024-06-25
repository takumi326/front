"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
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

export const MoneyCalendar = (): JSX.Element => {
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
  const [classificationMonth, setClassificationMonth] = useState("");

  const calendarRef = useRef<FullCalendar>(null);

  const handleDateChange = () => {
    if (calendarRef.current) {
      const calendarApi: CalendarApi = calendarRef.current.getApi();

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

  const getNextMonth = (yearMonth: string) => {
    const year = Number(yearMonth.slice(0, 4));
    const month = Number(yearMonth.slice(4));

    let nextYear = year;
    let nextMonth = month + 1;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    return String(nextYear) + String(nextMonth);
  };

  const date = (month: string, date: string) =>
    new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(4)) - 1,
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

  const handleEventClick = (clickInfo: EventClickArg) => {
    let data:
      | paymentData
      | incomeData
      | transferData
      | classificationData
      | undefined;

    if (clickInfo.event.extendedProps.paymentId) {
      const paymentId = clickInfo.event.extendedProps.paymentId;
      data = calendarPayments.find((payment) => payment.id === paymentId);
      if (data && payments) {
        const showPayment = allPayments.find(
          (showPayment) => showPayment.id === data!.id
        );
        if (showPayment) {
          selectedEvent = showPayment;
          setSortedPaymentRows([showPayment]);
          setSortedIncomeRows([]);
          setSortedTransferRows([]);
          setSortedClassificationRows([]);
        }
      }
    } else if (clickInfo.event.extendedProps.incomeId) {
      const incomeId = clickInfo.event.extendedProps.incomeId;
      data = calendarIncomes.find((income) => income.id === incomeId);
      if (data && incomes) {
        const showIncome = allIncomes.find(
          (showIncome) => showIncome.id === data!.id
        );
        if (showIncome) {
          selectedEvent = showIncome;
          setSortedPaymentRows([]);
          setSortedIncomeRows([showIncome]);
          setSortedTransferRows([]);
          setSortedClassificationRows([]);
        }
      }
    } else if (clickInfo.event.extendedProps.transferId) {
      const transferId = clickInfo.event.extendedProps.transferId;
      data = calendarTransfers.find((transfer) => transfer.id === transferId);
      if (data && transfers) {
        const showTransfer = allTransfers.find(
          (showTransfer) => showTransfer.id === data!.id
        );
        if (showTransfer) {
          selectedEvent = showTransfer;
          setSortedPaymentRows([]);
          setSortedIncomeRows([]);
          setSortedTransferRows([showTransfer]);
          setSortedClassificationRows([]);
        }
      }
    } else {
      const classificationId = clickInfo.event.extendedProps.classificationId;
      data = classifications.find(
        (classification) => classification.id === classificationId
      );
      if (data && classifications) {
        const showClassification = classifications.find(
          (showClassification) => showClassification.id === data!.id
        );
        if (showClassification) {
          selectedEvent = showClassification;
          setSortedPaymentRows([]);
          setSortedIncomeRows([]);
          setSortedTransferRows([]);
          setSortedClassificationRows([showClassification]);
          setClassificationMonth(
            clickInfo.event.extendedProps.classificationMonth
          );
        }
      }
    }

    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  const historyEvents =
    filter === "payment"
      ? calendarPayments.map((payment) => ({
          paymentId: payment.id,
          title: payment.category_name,
          start: payment.schedule,
          allDay: true,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : filter === "income"
      ? calendarIncomes.map((income) => ({
          incomeId: income.id,
          title: income.category_name,
          start: income.schedule,
          allDay: true,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : calendarTransfers.map((transfer) => ({
          transferId: transfer.id,
          title:
            // accounts.filter(
            //   (account) => account.id === transfer.before_account_id
            // )[0].name +
            // "→" +
            transfer.after_account_name,
          start: transfer.schedule,
          allDay: true,
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
                    classification.id &&
                  classificationMonthlyAmount.date != "-1"
              )
              .map((classificationMonthlyAmount) => ({
                classificationId: classification.id,
                classificationMonth: classificationMonthlyAmount.month,
                title:
                  classification.name +
                  " " +
                  classificationMonthlyAmount.month.slice(4) +
                  "月分",
                start: date(
                  getNextMonth(classificationMonthlyAmount.month),
                  classificationMonthlyAmount.date
                ),
                allDay: true,
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
                calendarMonth={classificationMonth}
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
            end: "myCustomButton prev,next",
          }}
          customButtons={{
            myCustomButton: {
              text: "今月",
              click: handleTodayClick,
            },
          }}
          eventClick={handleEventClick}
          eventClassNames="cursor-pointer"
        />
      </div>
    </>
  );
};
