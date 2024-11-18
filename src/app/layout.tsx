import Header from "@/components/header";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Job Portal",
  description: "Find and post jobs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t py-6">
          <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Student Job Portal. All rights reserved.
            </p>
            <nav className="mt-4 flex gap-4 sm:mt-0 sm:gap-6">
              <a
                href="/terms"
                className="text-xs underline-offset-4 hover:underline"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-xs underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
