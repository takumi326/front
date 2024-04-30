"use client";
import React from "react";

import { Calendar } from "@/components/plate/Calendar";
import { PurposeTable } from "@/components/plate/purposeTable";


const Purpose: React.FC = () => {
  return (
    <>
      <ul className="py-10 grid grid-cols-2">
        <div className="pl-10 max-w-3xl">
          <Calendar />
        </div>
        <div className="pr-10">
          <p className="font-bold text-lg">目標一覧</p>
          <PurposeTable />
        </div>
      </ul>
    </>
  );
};

export default Purpose;
