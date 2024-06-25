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
      <div className="text-center pt-16">
        <p className="font-bold text-7xl">Task × Money</p>
      </div>
      <ul>
        <li className="flex mx-5 mt-16 justify-center">
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
              ゲストログイン
            </button>
          </li>
        )}
      </ul>
    </>
  );
};
