import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../lib/providers";

export const metadata: Metadata = {
  title: "Next Fetch",
  description:
    "Data fetching test in various environments for a Next.js project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
