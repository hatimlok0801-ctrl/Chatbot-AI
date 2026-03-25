import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESPECT.EXE",
  description: "Public prompt arena. Brutal feedback. Precision answers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


