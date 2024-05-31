import React from "react";

import { MoneyCalendar } from "@/components/plate/moneyCalendar";
import { MoneyTable } from "@/components/plate/moneyTable";
import { AccountNextMonthTable } from "@/components/plate/accountNextMonthTable";

import { MoneyProvider } from "@/context/money-context";

const Money: React.FC = () => {
  return (
    <>
      <MoneyProvider>
        <ul className="py-6 grid grid-cols-2">
          <div className="pl-10 max-w-3xl">
            <div>
              <div className="flex justify-between font-bold">
                <p>年の変更</p>
                <p className="text-right">月の変更</p>
              </div>
              <MoneyCalendar />
            </div>
            <div className="">
              <p className=" font-bold text-center">
                来月以降口座に残ってるお金 （口座ごと）
              </p>
              <AccountNextMonthTable />
            </div>
          </div>
          <div className="pr-10">
            <div className="pr-10 pt-5">
              <MoneyTable />
            </div>
          </div>
        </ul>
      </MoneyProvider>
    </>
  );
};

export default Money;
