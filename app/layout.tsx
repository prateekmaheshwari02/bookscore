import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookScore",
  description: "Measure how deeply you understand the books you read."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
