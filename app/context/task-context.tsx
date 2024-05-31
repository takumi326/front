"use client";
import React, { useState, createContext, useEffect } from "react";

import { purposeGetData } from "@/lib/api/purpose-api";

import {
  taskData,
  completedRepetitionTaskData,
} from "@/interface/task-interface";
import { purposeData } from "@/interface/purpose-interface";

export const taskContext = createContext<{
  tableTasks: taskData[];
  setTableTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  calendarTasks: taskData[];
  setCalendarTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  allTasks: taskData[];
  setAllTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  completedRepetitionTasks: completedRepetitionTaskData[];
  setCompletedRepetitionTasks: React.Dispatch<
    React.SetStateAction<completedRepetitionTaskData[]>
  >;
  purposes: purposeData[];
  setPurposes: React.Dispatch<React.SetStateAction<purposeData[]>>;
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  tableTasks: [],
  setTableTasks: () => {},
  calendarTasks: [],
  setCalendarTasks: () => {},
  allTasks: [],
  setAllTasks: () => {},
  completedRepetitionTasks: [],
  setCompletedRepetitionTasks: () => {},
  purposes: [],
  setPurposes: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
  isEditing: false,
  setIsEditing: () => {},
});

export const TaskProvider: React.FC = ({ children }) => {
  const [tableTasks, setTableTasks] = useState<taskData[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<taskData[]>([]);
  const [allTasks, setAllTasks] = useState<taskData[]>([]);
  const [completedRepetitionTasks, setCompletedRepetitionTasks] = useState<
    completedRepetitionTaskData[]
  >([]);
  const [purposes, setPurposes] = useState<purposeData[]>([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    purposeGetData().then((data) => {
      setPurposes(data);
    });
  }, []);

  return (
    <taskContext.Provider
      value={{
        tableTasks,
        setTableTasks,
        calendarTasks,
        setCalendarTasks,
        allTasks,
        setAllTasks,
        completedRepetitionTasks,
        setCompletedRepetitionTasks,
        currentMonth,
        setCurrentMonth,
        purposes,
        setPurposes,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
