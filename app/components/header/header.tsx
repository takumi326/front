"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import { signOut } from "@/lib/api/auth";
import { AuthContext } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        // サインアウト時には各Cookieを削除
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        router.push("/");

        console.log("Succeeded in sign out");
      } else {
        console.log("Failed in sign out");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        console.log(isSignedIn);
        return (
          <>
          <ul className="flex ml-auto ml-64">
            <li className="">
              <Link href="/">アカウント設定</Link>
            </li>
            <li className="mx-10">
              <button onClick={handleSignOut}>ログアウト</button>
            </li>
          </ul>
        </>
      )} else {
        console.log(isSignedIn);
        return (
          <>
            <ul className="flex ml-auto ml-64">
              <li className="">
                <Link href="/login">ログイン</Link>
              </li>
              <li className="mx-10">
                <Link href="/signup">サインアップ</Link>
              </li>
            </ul>
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <header>
      <div className="py-6 flex">
        <div className="mx-10">
          <Link href="/top" className="">
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
        <AuthButtons />
      </div>
    </header>
  );
};
