"use client";
import React, { useState, createContext } from "react";

import { taskData } from "@/interface/task-interface";

export const taskContext = createContext<{
  tasks: taskData[];
  setTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  allTasks: taskData[];
  setAllTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
}>({
  tasks: [],
  setTasks: () => {},
  allTasks: [],
  setAllTasks: () => {},
  currentMonth: "",
  setCurrentMonth: () => {},
});

export const TaskProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<taskData[]>([]);
  const [allTasks, setAllTasks] = useState<taskData[]>([]);
  const [currentMonth, setCurrentMonth] = useState("");

  return (
    <taskContext.Provider
      value={{
        tasks,
        setTasks,
        currentMonth,
        setCurrentMonth,
        allTasks,
        setAllTasks,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
