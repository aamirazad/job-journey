import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
      <body className="relative flex min-h-screen flex-col">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <Header />
        <div className="absolute left-0 top-0 -z-10 flex h-full w-full flex-col">
          <div className="w-full flex-1 bg-gradient-to-b from-[#FF499E]/10 to-[#D264B6]/10" />
          <div className="w-full flex-1 bg-gradient-to-b from-[#D264B6]/10 to-[#A480CF]/10" />
          <div className="w-full flex-1 bg-gradient-to-b from-[#A480CF]/10 to-[#779BE7]/30" />
          <div className="w-full flex-1 bg-gradient-to-b from-[#779BE7]/30 to-[#49B6FF]/30" />
        </div>
        <main className="mt-16 flex-1 md:mt-8">
          <NuqsAdapter>{children}</NuqsAdapter>
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
