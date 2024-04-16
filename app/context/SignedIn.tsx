"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 認証済みの場合はmypageページへリダイレクト
    if (
      Cookies.get("_access_token") &&
      Cookies.get("_client") &&
      Cookies.get("_uid")
    ) {
      router.push("/mypage");
    }
  }, [pathname]);

  return <>{children}</>;
};
