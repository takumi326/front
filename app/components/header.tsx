import React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="py-6 flex">
        <div className="mx-10">
          <Link href="/" className="">
            タスマネ
          </Link>
        </div>
        <ul className="ml-24 grid grid-cols-5 gap-24">
          <li className="">
            <Link href="/mypage">MYページ</Link>
          </li>
          <li className="">
            <Link href="/">お金管理</Link>
          </li>
          <li className="">
            <Link href="/">目標管理</Link>
          </li>
          <li className="">
            <Link href="/">タスク管理</Link>
          </li>
          <li className="">
            <Link href="/">タイマー</Link>
          </li>
        </ul>
        <ul className="flex ml-auto ml-64">
          <li className="">
            <Link href="/sign_up">アカウント設定</Link>
          </li>
          <li className="mx-10">
            <Link href="/login">ログイン</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
