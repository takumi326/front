"use client";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import moneyImage from "@/../public/TOPお金.png";
import taskImage from "@/../public/TOP-removebg-preview.png";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { authContext } from "@/context/auth-context";
import { signIn } from "@/lib/api/auth";
import { signInParams } from "@/interface/auth-interface";

export const TopForm: React.FC = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const { setcurrentUserId, setIsSignedIn, setCurrentUser } =
    useContext(authContext);

  useEffect(() => {
    const accessToken = Cookies.get("_access_token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const isAuthenticated = accessToken && client && uid;
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = async () => {
    const params: signInParams = {
      email: "guest111@getRequestMeta.com",
      password: "password",
    };

    try {
      const res = await signIn(params);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setcurrentUserId(res.data.data.id);

        router.push(`/money`);

        // console.log("Signed in successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="text-center pt-8">
        <p className="font-bold text-7xl">Task × Money</p>
      </div>
      <ul>
        {/* <li className="flex mx-5 mt-16 justify-center">
          <div className="flex">
            <div className="pr-32">
              <Image
                src={taskImage}
                alt="LOGO"
                width={265}
                height={265}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div>
              <Image
                src={moneyImage}
                alt="LOGO"
                width={265}
                height={265}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </li> */}
        <li className="flex mx-5 mt-16 justify-center">
          <div className="service-intro-section pb-18">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="service-card p-6 bg-white shadow-lg rounded-lg min-w-xs min-w-80 max-w-xs mx-auto">
                <div className="flex justify-center items-center">
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    タスク
                  </h3>
                  <div className="service-icon mb-4">
                    <Image
                      src={taskImage}
                      alt="LOGO"
                      className="w-16 h-16 mx-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    管理
                  </h3>
                </div>
                <p className="text-left text-lg pl-6 pb-3">
                  目標を設定した後、その目標に対してのタスクを設定してスケジュールを立てることができます。
                </p>
                <p className="text-left text-lg pl-8 pb-3">
                  ・目標ごとにタスクを選択
                </p>
                <p className="text-left text-lg pl-8 pb-3">・リピート機能</p>
                <p className="text-left text-lg pl-8 pb-3">・カレンダー機能</p>
              </div>
              <div className="service-card p-6 bg-white shadow-lg rounded-lg min-w-xs min-w-80 max-w-xs mx-auto">
                <div className="flex justify-center items-center">
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    お金
                  </h3>
                  <div className="service-icon mb-4">
                    <Image
                      src={moneyImage}
                      alt="LOGO"
                      className="w-16 h-16 mx-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    管理
                  </h3>
                </div>
                <p className="text-left pl-6 pb-3">
                  残高に口座の金額を入れて、そこから毎日支出、収入によって残高の金額が変動するようになっています。
                </p>
                <p className="text-left text-lg pl-8 pb-3">
                  ・支出、収入、残高
                </p>
                <p className="text-left text-lg pl-8 pb-3">・リピート機能</p>
                <p className="text-left text-lg pl-8 pb-3">
                  ・予想残高確認機能
                </p>
                <p className="text-left text-lg pl-8 pb-3">・カレンダー機能</p>
              </div>
            </div>
          </div>
        </li>
        {authenticated ? (
          <li className="pt-14 pb-20 "></li>
        ) : (
          <li className="flex py-5 justify-center">
            <button
              type="submit"
              className="font-bold text-xl bg-blue-500 px-3 rounded-full text-white mt-8 mb-9"
              onClick={handleSubmit}
            >
              ゲストログインはこちら
            </button>
          </li>
        )}
      </ul>
    </>
  );
};
