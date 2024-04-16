import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "@/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
          <Header />
          <div className="bg-gray-100">{children}</div>
          <Footer />
      </body>
    </html>
  );
}
