"use client";
import React, { createContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { getCurrentUser } from "@/lib/api/auth";
import { User } from "@/interface/auth-interface";

export const authContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  currentUserId: number | undefined;
  setcurrentUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
}>({
  loading: false,
  setLoading: () => {},
  isSignedIn: false,
  setIsSignedIn: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  currentUserId: undefined,
  setcurrentUserId: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [currentUserId, setcurrentUserId] = useState<number | undefined>(
    undefined
  );
  const router = useRouter();
  const pathname = usePathname();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      console.log(res);

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        setcurrentUserId(res?.data.data.id);

        console.log(res?.data.data);
      } else {
        console.log("No current user");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  useEffect(() => {
    // 未認証の場合はsigninページへリダイレクト
    if (!loading && !isSignedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, isSignedIn, pathname, router]);

  return (
    <authContext.Provider
      value={{
        loading,
        setLoading,
        isSignedIn,
        setIsSignedIn,
        currentUser,
        setCurrentUser,
        currentUserId,
        setcurrentUserId,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
