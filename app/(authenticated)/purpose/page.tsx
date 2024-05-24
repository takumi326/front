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
            <div>
              <div className="flex justify-between font-bold">
                <p>年の変更</p>
                <p className="text-right">月の変更</p>
              </div>
              <PurposeCalendar />
            </div>
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
