"use client";
import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import { taskGetData as getData } from "@/lib/api/task-api";

import { taskContext } from "@/context/task-context";
import { moneyContext } from "@/context/money-context";

export const MoneyCalendar = (): JSX.Element => {
  const {
    classifications,
    setClassifications,
    payments,
    setPayments,
    incomes,
    setIncomes,
    accounts,
    setAccounts,
    transfers,
    setTransfers,
    filter,
    setFilter,
  } = useContext(moneyContext);

  // useEffect(() => {
  //   getData().then((data) => {
  //     setTasks(data);
  //   });
  // }, []);

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
      ? payments.map((item) => ({
          title: item.category_name,
          start: item.schedule,
          allDay: item.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : filter === "income"
      ? incomes.map((item) => ({
          title: item.category_name,
          start: item.schedule,
          allDay: item.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }))
      : transfers.map((item) => ({
          title: item.after_account_name +"   "+ formatAmountCommas(item.amount),
          start: item.schedule,
          allDay: item.schedule,
          backgroundColor: "green",
          borderColor: "green",
        }));

  const eventss = classifications
    .filter((classification) => classification.schedule !== null)
    .map((item) => ({
      title: item.name,
      start: item.schedule,
      allDay: item.schedule,
      backgroundColor: "red",
      borderColor: "red",
    }));

  return (
    <div className="py-10">
      <FullCalendar
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
