import React from "react";
import "@/globals.css";

import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="bg-gray-100">{children}</div>
      <Footer />
    </>
  );
}
