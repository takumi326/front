import React from "react";

import { MoneyCalendar } from "@/components/plate/moneyCalendar";
import { PurposeTable } from "@/components/plate/purposeTable";

import { PurposeProvider } from "@/context/purpose-context";

const Money: React.FC = () => {
  return (
    <>
      <PurposeProvider>
        <ul className="py-10 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <MoneyCalendar />
          </div>
          <div className="pr-10">
            <p className="font-bold text-lg">収支一覧</p>
            <PurposeTable />
          </div>
        </ul>
      </PurposeProvider>
    </>
  );
};

export default Money;
