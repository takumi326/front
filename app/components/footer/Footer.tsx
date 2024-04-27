import React from "react";
import Link from "next/link";

import { Typography, Container, Grid, Box } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200">
      <div className="py-6 flex justify-center">
        <ul className="flex">
          <li className="mr-32">
            <Link href="/">プライバシーポリシー</Link>
          </li>
          <li className="mr-32">
            <Link href="/">利用規約</Link>
          </li>
          <li className="">
            <Link href="/">お問い合わせ</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
