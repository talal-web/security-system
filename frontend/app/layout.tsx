// src/app/layout.tsx

import type { Metadata } from "next";
import { Suspense } from "react";

import { Toaster } from "sonner";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import { AreaProvider } from "@/components/area/AreaContext";

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
    <html lang="en">
      <body className="bg-canvas font-sans text-slate-900 antialiased">
        <QueryProvider>
          <Suspense
            fallback={
              <div
                className="flex min-h-screen items-center justify-center bg-canvas text-sm text-slate-500"
                role="status"
              >
                Loading application...
              </div>
            }
          >
            <AreaProvider>
              {/* TOAST */}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3000}
                toastOptions={{
                  className: "!rounded-xl !shadow-pop",
                }}
              />

              {/* Public pages render the site navbar/footer via (public)/layout;
                  authenticated pages render the app shell via (protected)/layout. */}
              {children}
            </AreaProvider>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
