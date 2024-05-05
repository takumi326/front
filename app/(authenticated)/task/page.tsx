"use client";
import React from "react";

import { TaskCalendar } from "@/components/plate/taskCalendar";
import { TaskTable } from "@/components/plate/taskTable";

import { TaskProvider } from "@/context/task-context";

const Task: React.FC = () => {
  return (
    <>
    <TaskProvider>
      <ul className="py-10 grid grid-cols-2">
        <div className="pl-10 max-w-3xl">
          <TaskCalendar />
        </div>
        <div className="pr-10">
          <p className="font-bold text-lg">タスク一覧</p>
          <TaskTable />
        </div>
      </ul>
      </TaskProvider>
    </>
  );
};

export default Task;
