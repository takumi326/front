"use client";
import React, { useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

import { AuthContext } from "@/context/AuthContext";

export const DifferentUserId: React.FC = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUserId } = useContext(AuthContext);

  useEffect(() => {
    // 認証済みの場合はmypageページへリダイレクト
    if (pathname !== `/mypage/${currentUserId}`) {
      router.push(`/mypage/${currentUserId}`);
    }
  }, [pathname, router]);

  return <>{children}</>;
};
