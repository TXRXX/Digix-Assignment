import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Library",
  description: "Manage your book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${notoSansThai.variable} h-full antialiased`}
    >
      <Toaster position="top-right" />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
