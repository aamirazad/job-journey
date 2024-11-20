import Footer from "@/components/footer";
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
        <main className="flex flex-1 flex-col mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
