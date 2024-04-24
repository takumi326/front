import React from "react";
import { Calendar } from "@/components/plate/calendar/Calendar";
import { TableShow } from "@/components/plate/table/Table";

const Task: React.FC = () => {
  return (
    <>
      <ul className="py-10 grid grid-cols-2">
        <div className="pl-10 max-w-3xl">
          <Calendar />
        </div>
        <div className="pr-10">
          <p className="font-bold text-lg">タスク一覧</p>
          <TableShow />
        </div>
      </ul>
    </>
  );
};

export default Task;


