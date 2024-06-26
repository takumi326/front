"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarApi, EventClickArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import CloseIcon from "@mui/icons-material/Close";

import { taskContext } from "@/context/task-context";

import { taskData } from "@/interface/task-interface";

import { TaskShow } from "@/components/task/show";

export const TaskCalendar = (): JSX.Element => {
  const { calendarTasks, allTasks, setCurrentMonth } = useContext(taskContext);

  const [selectedEvent, setSelectedEvent] = useState<taskData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEventClick = (clickInfo: EventClickArg) => {
    const task = calendarTasks.find(
      (task) => task.id === clickInfo.event.extendedProps.taskId
    );
    if (task !== undefined) {
      if (allTasks) {
        const showTask = allTasks.find(
          (showTask: taskData) => showTask.id === task.id
        );
        setSelectedEvent(showTask);
      }
    }
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const notCompletedEvents = calendarTasks
    .filter((task) => task.completed === false)
    .map((item) => ({
      taskId: item.id,
      title: item.title,
      start: item.schedule,
      allDay: true,
      backgroundColor: "green",
      borderColor: "green",
    }));

  const completedEvents = calendarTasks
    .filter((task) => task.completed === true)
    .map((item) => ({
      taskId: item.id,
      title: item.title,
      start: item.schedule,
      allDay: true,
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
              <TaskShow
                id={selectedEvent.id}
                title={selectedEvent.title}
                purpose_id={selectedEvent.purpose_id}
                schedule={selectedEvent.schedule}
                end_date={selectedEvent.end_date}
                repetition={selectedEvent.repetition}
                repetition_type={selectedEvent.repetition_type}
                repetition_settings={selectedEvent.repetition_settings}
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
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale="ja"
          height={638}
          events={events}
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
