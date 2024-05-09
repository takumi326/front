import React from "react";

import { PurposeCalendar } from "@/components/plate/purposeCalendar";
import { PurposeTable } from "@/components/plate/purposeTable";

import { PurposeProvider } from "@/context/purpose-context";

const Purpose: React.FC = () => {
  return (
    <>
      <PurposeProvider>
        <ul className="py-6 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <PurposeCalendar />
          </div>
          <div className="pr-10">
            <p className="font-bold text-lg">目標一覧</p>
            <PurposeTable />
          </div>
        </ul>
      </PurposeProvider>
    </>
  );
};

export default Purpose;
