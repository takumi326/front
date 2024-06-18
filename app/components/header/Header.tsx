"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import { Box } from "@mui/material";

import { signOut } from "@/lib/api/auth";
import { authContext } from "@/context/auth-context";
import { headerContext } from "@/context/header-context";

export const Header: React.FC = () => {
  const { setIsSignedIn } = useContext(authContext);
  const { setting, setSetting } = useContext(headerContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname.includes("/top")) {
      setSetting("TOP");
    } else if (pathname.includes("/money")) {
      setSetting("Money");
    } else if (pathname.includes("/purpose")) {
      setSetting("Purpose");
    } else if (pathname.includes("/task")) {
      setSetting("Task");
    }
    const accessToken = Cookies.get("_access_token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const isAuthenticated = accessToken && client && uid;
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  }, []);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
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

  // const changedTOP = () => setSetting("TOP");
  // const changedMoney = () => setSetting("Money");
  // const changedPurpose = () => setSetting("Purpose");
  // const changedTask = () => setSetting("Task");

  const handleClick = (newSetting, href) => (event) => {
    event.preventDefault();
    setSetting(newSetting);
    router.push(href);
  };

  return (
    <header>
      <div className="h-20  items-center flex">
        <div className="mx-10">
          <Link href="/top" className="">
            タスマネ
          </Link>
        </div>
        <ul className="ml-64 grid grid-cols-4 gap-24">
          {authenticated ? (
            <>
              <li className="">
                {setting === "TOP" && (
                  <Box
                    component="li"
                    sx={{
                      borderBottom: "5px solid black",
                      mb: 1,
                      mr: 5,
                    }}
                  ></Box>
                )}
                <button onClick={handleClick("TOP", "/top")}>TOP</button>
              </li>
              <li className="">
                {setting === "Money" && (
                  <Box
                    component="li"
                    sx={{
                      borderBottom: "5px solid black",
                      mb: 1,
                      mr: 1,
                    }}
                  ></Box>
                )}

                <button onClick={handleClick("Money", "/money")}>
                  お金管理
                </button>
              </li>
              <li className="">
                {setting === "Purpose" && (
                  <Box
                    component="li"
                    sx={{
                      borderBottom: "5px solid black",
                      mb: 1,
                    }}
                  ></Box>
                )}
                <button onClick={handleClick("Purpose", "/purpose")}>
                  目的管理
                </button>
              </li>
              <li className="">
                {setting === "Task" && (
                  <Box
                    component="li"
                    sx={{
                      borderBottom: "5px solid black",
                      mb: 1,
                    }}
                  ></Box>
                )}
                <button onClick={handleClick("Task", "/task")}>
                  タスク管理
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="">
                <Link href={`/top`}></Link>
              </li>
            </>
          )}
        </ul>
        <ul className="flex ml-auto ml-64">
          {authenticated ? (
            <li className="mx-10">
              <button onClick={handleSignOut}>ログアウト</button>
            </li>
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
