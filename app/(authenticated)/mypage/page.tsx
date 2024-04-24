import React from "react";
import { Calendar } from "@/components/plate/calendar/Calendar";
// import { DifferentUserId } from "@/components/differentuserid/DifferentUserId";

const Mypage: React.FC = () => {
  return (
    <>
      <ul className="py-20 grid grid-cols-2">
        <div className="pl-10 max-w-3xl">
          <Calendar />
        </div>
        <div className="pl-10 max-w-3xl">
          <p>
            MYpe-zi
            ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
          </p>
        </div>
      </ul>
    </>
  );
};

export default Mypage;
