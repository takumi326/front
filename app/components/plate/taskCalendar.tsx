"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

import { taskGetData as getData } from "@/lib/api/task-api";

import { taskContext } from "@/context/task-context";

export const TaskCalendar = (): JSX.Element => {
  const { allTasks, setAllTasks, currentMonth, setCurrentMonth } =
    useContext(taskContext);

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
    console.log(allTasks);
    console.log(currentMonth);
    const calendarApi = calendarRef.current.getApi();

    calendarApi.on("datesSet", handleDateChange); // datesSetイベントリスナーを追加

    // クリーンアップ
    return () => {
      calendarApi.off("datesSet", handleDateChange);
    };
  }, []);

  const events = allTasks.map((item) => ({
    title: item.title,
    start: item.schedule,
    allDay: item.schedule,
    description: item.body,
    backgroundColor: "green",
    borderColor: "green",
  }));

  return (
    <div className="pb-14">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        height={638}
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
