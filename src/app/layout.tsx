import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AppProviders from "@/components/providers/AppProviders";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
         * ErrorBoundary bao toàn bộ app — catch unhandled errors từ bất kỳ component nào.
         * Thay thế hoặc bọc thêm fallback UI theo từng feature nếu cần granular error handling.
         */}
        <ErrorBoundary>
          <AppProviders>{children}</AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
