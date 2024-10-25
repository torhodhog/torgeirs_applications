import type { Metadata } from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import { cn } from "../lib/utils";
import Navbar from "../components/Navbar";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Applications",
  description: "By Torgeir Hodne-Høgheim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("relative h-full font-sans antialiased", inter.className)}>
       <Navbar />
       <main className="relative flex felx-col min-h-screen">
        {/* <Navbar /> */}
        <div className="flex-grow flex-1">{children}</div>
         </main>
      </body>
    </html>
  );
}
