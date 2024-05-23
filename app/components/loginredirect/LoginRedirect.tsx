"use client";
import React, { useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const LoginRedirect: React.FC<{ children: React.ReactNode }> = ({
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
      router.push(`/money`);
    }
  }, [pathname, router]);

  return <>{children}</>;
};
