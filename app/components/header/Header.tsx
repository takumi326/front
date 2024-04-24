"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import { signOut } from "@/lib/api/auth";
import { AuthContext } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { currentUserId, setIsSignedIn } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("_access_token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const isAuthenticated = accessToken && client && uid;
    setAuthenticated(isAuthenticated);
  }, []);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        // サインアウト時には各Cookieを削除
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        router.push("/login");

        console.log("Succeeded in sign out");
      } else {
        console.log("Failed in sign out");
      }
    } catch (err) {
      console.log(err);
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
          {authenticated ? (
            <>
              <li className="">
                <Link href={`/mypage`}>MYページ</Link>
              </li>
            </>
          ) : (
            <>
              <li className="">
                <Link href={`/top`}></Link>
              </li>
            </>
          )}
          <li className="">
            <Link href="/top">お金管理</Link>
          </li>
          <li className="">
            <Link href="/purpose">目標管理</Link>
          </li>
          <li className="">
            <Link href="/task">タスク管理</Link>
          </li>
          <li className="">
            <Link href="/top">タイマー</Link>
          </li>
        </ul>
        <ul className="flex ml-auto ml-64">
          {authenticated ? (
            <>
              <li className="">
                <Link href="/top">アカウント設定</Link>
              </li>
              <li className="mx-10">
                <button onClick={handleSignOut}>ログアウト</button>
              </li>
            </>
          ) : (
            <>
              <li className="">
                <Link href="/login">ログイン</Link>
              </li>
              <li className="mx-10">
                <Link href="/signup">サインアップ</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};
