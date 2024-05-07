"use client";
import React, { useState, createContext } from "react";

import { taskData } from "@/interface/task-interface";

export const taskContext = createContext<{
  tasks: taskData[];
  setTasks: React.Dispatch<React.SetStateAction<taskData[]>>;
}>({
  tasks: [],
  setTasks: () => {},
});

export const TaskProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<taskData[]>([]);

  return (
    <taskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </taskContext.Provider>
  );
};
