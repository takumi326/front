import React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="py-4 flex justify-center">
        <Link href="/" className="ml-16">
          タスマネ
        </Link>
        <ul className="flex ml-64">
          <li className="ml-10 mr-32">
            <Link href="/">MYページ</Link>
          </li>
          <li className="mr-32">
            <Link href="/">お金管理</Link>
          </li>
          <li className="mr-32">
            <Link href="/">目標管理</Link>
          </li>
          <li className="mr-32">
            <Link href="/">タスク管理</Link>
          </li>
          <li className="mr-20">
            <Link href="/">タイマー</Link>
          </li>
        </ul>
        <ul className="flex ml-64">
          <li className="">
            <Link href="/">アカウント設定</Link>
          </li>
          <li className="ml-16">
            <Link href="/login">ログイン</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
