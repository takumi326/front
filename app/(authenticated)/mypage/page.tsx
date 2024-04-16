"use client";
import React from "react";
import { Calendar } from "@/components/calendar";
import { ChartPage } from "@/components/graph";

const Mypage: React.FC = () => {
  return (
    <div>
      <p>カレンダー</p>
      <Calendar />
      <p>グラフ1</p>
      <ChartPage />
    </div>
  );
};

export default Mypage;
