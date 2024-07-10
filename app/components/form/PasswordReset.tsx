"use client";
import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { authContext } from "@/context/auth-context";
import { ResetPassword } from "@/lib/api/auth";
import { ResetParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const PasswordReset: React.FC = () => {
  const router = useRouter();

//   const { setcurrentUserId, setIsSignedIn, setCurrentUser } =
//     useContext(authContext);
  const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: ResetParams = {
      email: email,
      redirect_url: "http://localhost:8000/reset",
    };

    try {
      await ResetPassword(params);
      router.push(`/login`);
      //   if (res.status === 200) {
      //     Cookies.set("_access_token", res.headers["access-token"]);
      //     Cookies.set("_client", res.headers["client"]);
      //     Cookies.set("_uid", res.headers["uid"]);

      //     setIsSignedIn(true);
      //     setCurrentUser(res.data.data);
      //     setcurrentUserId(res.data.data.id);

      //   } else {
      //     setAlertMessageOpen(true);
      //   }
    } catch (err) {
    //   console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <div className="mx-auto md:w-2/3 w-full px-10 pt-28 pb-16">
      <p className="text-4xl font-bold text-center">パスワードリセット</p>
      <form onSubmit={handleSubmit} className="mb-0">
        <div className="mt-16">
          <label htmlFor="email" className="text-2xl">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            placeholder="test@example.com"
            className="w-full my-5 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="text-left ">
          登録されているメールアドレスにパスワードリセットのメールを送信します
        </div>
        <div className="py-6 pb-24">
          <button
            type="submit"
            className="font-bold text-xl bg-blue-500 px-3 rounded-full text-white"
          >
            送信
          </button>
        </div>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスが無効です"
      />
    </div>
  );
};
