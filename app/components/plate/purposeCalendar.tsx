"use client";
import React, { useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {EventClickArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import CloseIcon from "@mui/icons-material/Close";

import { purposeContext } from "@/context/purpose-context";

import { purposeData } from "@/interface/purpose-interface";

import { PurposeShow } from "@/components/purpose/show";

export const PurposeCalendar = (): JSX.Element => {
  const { purposes } = useContext(purposeContext);

  const [selectedEvent, setSelectedEvent] = useState<purposeData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const purpose = purposes.find(
      (purpose) => purpose.id === clickInfo.event.extendedProps.purposeId
    );
    if (purpose) {
      setSelectedEvent(purpose);
    }
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const notCompletedEvents = purposes
    .filter((task) => task.completed === false)
    .map((item) => ({
      purposeId: item.id,
      title: item.title,
      start: item.deadline,
      allDay: true,
      description: item.body,
      backgroundColor: "green",
      borderColor: "green",
    }));

  const completedEvents = purposes
    .filter((purpose) => purpose.completed === true)
    .map((item) => ({
      purposeId: item.id,
      title: item.title,
      start: item.deadline,
      allDay: true,
      description: item.body,
      backgroundColor: "red",
      borderColor: "red",
    }));

  const events = [...notCompletedEvents, ...completedEvents];

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
            {selectedEvent !== undefined && (
              <PurposeShow
                id={selectedEvent.id}
                title={selectedEvent.title}
                result={selectedEvent.result}
                deadline={selectedEvent.deadline}
                body={selectedEvent.body}
                completed={selectedEvent.completed}
                onClose={handleEditCloseModal}
              />
            )}
          </div>
        </div>
      )}
      <div className="pb-14">
        <FullCalendar
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
          eventClick={handleEventClick}
          eventClassNames="cursor-pointer"
        />
      </div>
    </>
  );
};
