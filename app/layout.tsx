import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Utility Ops AI",
  description: "Low-cost utility operations + support intelligence demo app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
