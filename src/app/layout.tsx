import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import NextTopLoader from "nextjs-toploader";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { CSPostHogProvider } from "@/app/_analytics/provider";

export const metadata: Metadata = {
  title: "Student Job Portal",
  description: "Find and post jobs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CSPostHogProvider>
      <html lang="en" className={GeistSans.variable}>
        <body
          className="relative flex min-h-screen flex-col"
          style={{
            backgroundImage: `
          linear-gradient(to right, rgba(255,247,237,0.5), rgba(255,247,237,0.5)),
          url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fdba74' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
        `,
            backgroundAttachment: "fixed",
          }}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <NextTopLoader color="#f97316" showSpinner={false} />
          <Header />
          <div className="absolute top-0 left-0 -z-10 flex h-full w-full flex-col">
            <div className="w-full flex-1 bg-linear-to-b from-orange-100/10 to-orange-100/10" />
            <div className="w-full flex-1 bg-linear-to-b from-orange-100/10 to-orange-100/10" />
            <div className="w-full flex-1 bg-linear-to-b from-orange-100/10 to-orange-100/30" />
            <div className="w-full flex-1 bg-linear-to-b from-orange-100/30 to-orange-100/30" />
          </div>
          <main className="mt-16 flex-1 md:mt-8">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
          <Toaster />
          <Footer />
        </body>
      </html>
    </CSPostHogProvider>
  );
}
