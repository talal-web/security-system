// src/app/layout.tsx

import type { Metadata } from "next";

import { Toaster } from "sonner";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import QueryProvider from "@/providers/QueryProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Baidar Security Service",
  description: "Professional Security Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-slate-950 text-white antialiased">
        <QueryProvider>
          {/* TOAST */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
            toastOptions={{
              className: "!rounded-2xl !border !border-slate-800",
            }}
          />

          {/* NAVBAR */}
          <Navbar />

          {/* PAGE CONTENT */}
          <main className="min-h-screen pt-20">{children}</main>

          {/* FOOTER */}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
