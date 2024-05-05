"use client";
import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import { taskGetData as getData } from "@/lib/api/task-api";

import { taskContext } from "@/context/task-context";

export const TaskCalendar = (): JSX.Element => {
  const { tasks, setTasks } = useContext(taskContext);

  useEffect(() => {
    getData().then((data) => {
      setTasks(data);
    });
  }, []);

  const events = tasks.map((item) => ({
    title: item.title,
    start: item.schedule,
    allDay: item.schedule,
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
