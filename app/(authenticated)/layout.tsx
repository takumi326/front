import React from "react";
import "@/globals.css";

import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { AuthProvider } from "@/context/auth-context";
import { HeaderProvider } from "@/context/header-context";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <HeaderProvider>
          <Header />
          <div className="bg-gray-100">{children}</div>
          <Footer />
        </HeaderProvider>
      </AuthProvider>
    </>
  );
}
