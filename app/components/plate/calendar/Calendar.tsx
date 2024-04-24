"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";

export const Calendar = (): JSX.Element => {
  const eventExample = [
    //オブジェクトの中身はこんな感じ
    //satrtとendの日付で日を跨いだ予定を表示できる
    //背景のカラーもこの中で指定できる
    {
      title: "温泉旅行",
      start: new Date(),
      end: new Date().setDate(new Date().getDate() + 5),
      description: "友達と温泉旅行",
      backgroundColor: "green",
      borderColor: "green",
    },
    {
      title: "期末テスト",
      start: new Date().setDate(new Date().getDate() + 5),
      description: "2年最後の期末テスト",
      backgroundColor: "blue",
      borderColor: "blue",
    },
  ];

  return (
    <>
      <div className="py-10">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale="ja"
          height={605}
          dayCellContent={(e) => e.dayNumberText.replace("日", "")} // 日付の「日」を削除する
          headerToolbar={{
            start: "prevYear,nextYear",
            center: "title",
            end: "today prev,next",
          }}
          events={eventExample}
        />
      </div>
    </>
  );
};
