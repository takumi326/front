import React from "react";
import "@/globals.css";

import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <Header />
        <div className="bg-gray-100">{children}</div>
        <Footer />
      </AuthProvider>
    </>
  );
}
