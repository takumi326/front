"use client";
import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import { purposeGetData as getData } from "@/lib/api/purpose-api";

import { purposeContext } from "@/context/purpose-context";

export const PurposeCalendar = (): JSX.Element => {
  const { purposes, setPurposes } = useContext(purposeContext);

  useEffect(() => {
    getData().then((data) => {
      setPurposes(data);
    });
  }, []);

  const events = purposes.map((item) => ({
    title: item.title,
    start: item.deadline,
    allDay: item.deadline,
    description: item.body,
    backgroundColor: "green",
    borderColor: "green",
  }));

  return (
    <div className="py-10">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        height={605}
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
