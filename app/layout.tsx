import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Final Mile Assessment — Northeast Division",
  description:
    "Regional planning template for the Northeast Division Final Mile Readiness Assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
