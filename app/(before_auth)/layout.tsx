import React from "react";
import "@/globals.css";

import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { SignedIn } from "@/context/SignedIn";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <Header />
        <div className="bg-gray-100">{children}</div>
        <Footer />
      </SignedIn>
    </>
  );
}
