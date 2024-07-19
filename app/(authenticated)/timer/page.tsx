"use client";
import React from "react";

// import { TaskCalendar } from "@/components/plate/taskCalendar";
// import { TaskTable } from "@/components/plate/taskTable";

// import { TaskProvider } from "@/context/task-context";
import { TimerView } from "@/components/plate/timer";

const Timer: React.FC = () => {
  return (
    <>
      {/* <TaskProvider>
        <ul className="py-6 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <div>
              <div className="flex justify-between font-bold">
                <p>年の変更</p>
                <p className="text-right">月の変更</p>
              </div>
              <TaskCalendar />
            </div>
          </div>
          <div className="pr-10">
            <p className="font-bold text-lg">タスク一覧</p>
            <TaskTable />
          </div>
        </ul>
      </TaskProvider> */}
      <TimerView />
    </>
  );
};

export default Timer;
