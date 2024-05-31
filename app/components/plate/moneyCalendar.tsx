"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import { moneyContext } from "@/context/money-context";

export const MoneyCalendar = (): JSX.Element => {
  const {
    classifications,
    calendarPayments,
    calendarIncomes,
    calendarTransfers,
    filter,
    setCurrentMonth,
  } = useContext(moneyContext);

  // const [selectedEvent, setSelectedEvent] = useState<taskData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // const handleEventClick = (clickInfo) => {
  //   const task = calendarTasks.find(
  //     (task) => task.id === clickInfo.event.extendedProps.taskId
  //   );
  //   if (task !== undefined) {
  //     if (allTasks) {
  //       const showTask = allTasks.find(
  //         (showTask: taskData) => showTask.id === task.id
  //       );
  //       setSelectedEvent(showTask);
  //     }
  //   }
  //   setIsEditModalOpen(true);
  // };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
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

  const events =
    filter === "payment"
      ? calendarPayments.map((payment) => ({
          title: payment.category_name,
          start: payment.schedule,
          allDay: payment.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : filter === "income"
      ? calendarIncomes.map((income) => ({
          title: income.category_name,
          start: income.schedule,
          allDay: income.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : calendarTransfers.map((transfer) => ({
          title:
            transfer.after_account_name +
            "   " +
            formatAmountCommas(transfer.amount),
          start: transfer.schedule,
          allDay: transfer.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }));

  const allEvents =
    filter === "payment"
      ? classifications
          .filter(
            (classification) =>
              classification.schedule !== null &&
              classification.classification_type === "payment"
          )
          .map((item) => ({
            title: item.name,
            start: item.schedule,
            allDay: item.schedule,
            backgroundColor: "green",
            borderColor: "green",
          }))
      : filter === "income"
      ? classifications
          .filter(
            (classification) =>
              classification.schedule !== null &&
              classification.classification_type === "income"
          )
          .map((item) => ({
            title: item.name,
            start: item.schedule,
            allDay: item.schedule,
            backgroundColor: "green",
            borderColor: "green",
          }))
      : null;

  return (
    <div className="pb-5">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        height={473}
        events={events}
        businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
        dayCellContent={(e) => e.dayNumberText.replace("日", "")} // 日付の「日」を削除する
        headerToolbar={{
          start: "prevYear,nextYear",
          center: "title",
          end: "today prev,next",
        }}
        // eventClick={handleEventClick}
        eventClassNames="cursor-pointer"
      />
    </div>
  );
};
