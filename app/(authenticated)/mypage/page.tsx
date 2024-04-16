"use client";
import React from "react";
import { Calendar } from "@/components/calendar";
import { ChartPage } from "@/components/graph";
import { MyFunnel } from "@/components/graph2";

const Mypage: React.FC = () => {
  return (
    <div>
      <p>カレンダー</p>
      <Calendar />
      <p>グラフ1</p>
      <ChartPage />
      <p>グラフ2</p>
      <MyFunnel />
      <p>終わり</p>
    </div>
  );
};

export default Mypage;
