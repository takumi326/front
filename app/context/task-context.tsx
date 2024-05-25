"use client";
import React, { useState, createContext, useEffect } from "react";

import { purposeGetData } from "@/lib/api/purpose-api";

import { taskData } from "@/interface/task-interface";
import { purposeData } from "@/interface/purpose-interface";

export const taskContext = createContext<{
  tasks: taskData[];
  setTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  allTasks: taskData[];
  setAllTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  purposes: purposeData[];
  setPurposes: React.Dispatch<React.SetStateAction<purposeData[]>>;
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
}>({
  tasks: [],
  setTasks: () => {},
  allTasks: [],
  setAllTasks: () => {},
  purposes: [],
  setPurposes: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
});

export const TaskProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<taskData[]>([]);
  const [allTasks, setAllTasks] = useState<taskData[]>([]);
  const [purposes, setPurposes] = useState<purposeData[]>([]);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    purposeGetData().then((data) => {
      setPurposes(data);
    });
  }, []);

  return (
    <taskContext.Provider
      value={{
        tasks,
        setTasks,
        currentMonth,
        setCurrentMonth,
        purposes,
        setPurposes,
        allTasks,
        setAllTasks,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
