import React from "react";
import Image from "next/image";
import moneyImage from "../public/TOPお金.png";
import taskImage from "../public/TOP-removebg-preview.png";

export default function TOP() {
  return (
    <div className="bg-gray-100">
      <div className="text-center pt-16">
        <p className="font-sans font-bold text-7xl">Task × Money</p>
      </div>
      <ul>
        <li className="flex mx-5 mt-16 justify-center">
          <div className="border-8 flex">
            <div className="">
              <Image
                src={taskImage}
                alt="LOGO"
                width={265}
                height={265}
                priority
              />
            </div>
            <div className="">
              <p className="">タスク説明文:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
            </div>
          </div>
        </li>
        <li className="flex py-5 justify-center">
          <div className="border-8 flex">
            <div className="">
              <p className="">マネー説明文:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
            </div>
            <div className="">
              <Image
                src={moneyImage}
                alt="LOGO"
                width={265}
                height={265}
                priority
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
