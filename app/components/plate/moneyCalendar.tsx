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
    setClassifications,
    classificationMonthlyAmounts,
    setClassificationMonthlyAmounts,
    categories,
    setCategories,
    allPayments,
    setAllPayments,
    payments,
    setPayments,
    allIncomes,
    setAllIncomes,
    incomes,
    setIncomes,
    accounts,
    setAccounts,
    allTransfers,
    setAllTransfers,
    transfers,
    setTransfers,
    filter,
    setFilter,
    currentMonth,
    setCurrentMonth,
  } = useContext(moneyContext);

  // useEffect(() => {
  //   getData().then((data) => {
  //     setTasks(data);
  //   });
  // }, []);

  const calendarRef = useRef(null);

  const handleDateChange = () => {
    const calendarApi = calendarRef.current.getApi();
    const currentDate = calendarApi.getDate();
    setCurrentMonth(
      `${currentDate.getFullYear()}${currentDate.getMonth() + 1}`
    );
  };

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.on("datesSet", handleDateChange); // datesSetイベントリスナーを追加

    // クリーンアップ
    return () => {
      calendarApi.off("datesSet", handleDateChange);
    };
  }, []);

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
      ? allPayments.map((item) => ({
          title: item.category_name,
          start: item.schedule,
          allDay: item.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : filter === "income"
      ? allIncomes.map((item) => ({
          title: item.category_name,
          start: item.schedule,
          allDay: item.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : allTransfers.map((item) => ({
          title:
            item.after_account_name + "   " + formatAmountCommas(item.amount),
          start: item.schedule,
          allDay: item.schedule,
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
    <div className="">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        height={525}
        events={events}
        businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
        dayCellContent={(e) => e.dayNumberText.replace("日", "")} // 日付の「日」を削除する
        headerToolbar={{
          start: "prevYear,nextYear",
          center: "title",
          end: "today prev,next",
        }}
      />
    </div>
  );
};
