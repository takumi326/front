"use client";
import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { authContext } from "@/context/auth-context";
import { signIn } from "@/lib/api/auth";
import { signInParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const LoginForm: React.FC = () => {
  const router = useRouter();

  const { setcurrentUserId, setIsSignedIn, setCurrentUser } =
    useContext(authContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: signInParams = {
      email: email,
      password: password,
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
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <div className="mx-auto md:w-2/3 w-full px-10 pt-28 pb-16">
      <p className="text-4xl font-bold text-center">ログイン</p>
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
        <div>
          <label htmlFor="password" className="text-2xl">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            className="w-full my-5 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="py-6 pb-24">
          <button
            type="submit"
            className="font-bold text-xl bg-blue-500 px-3 rounded-full text-white"
          >
            ログイン
          </button>
        </div>
      </form>
      <AlertMessage 
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Invalid emai or password"
      />
    </div>
  );
};
