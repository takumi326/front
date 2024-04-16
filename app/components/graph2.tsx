"use client";
import React from "react";
import { NextPage } from "next";
import { FunnelChart, Tooltip, Funnel, LabelList } from "recharts";

type Data = {
  value: number;
  name: string;
  fill: string;
};

const data: Data[] = [
  {
    value: 100,
    name: "Sent",
    fill: "#8884d8",
  },
  {
    value: 80,
    name: "Viewed",
    fill: "#83a6ed",
  },
  {
    value: 50,
    name: "Clicked",
    fill: "#8dd1e1",
  },
  {
    value: 40,
    name: "Add To Card",
    fill: "#82ca9d",
  },
  {
    value: 26,
    name: "Purchased",
    fill: "#a4de6c",
  },
];

export const MyFunnel: NextPage = () => {
  return (
    <>
      <FunnelChart width={730} height={250}>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="name"
          />
        </Funnel>
      </FunnelChart>
    </>
  );
};
