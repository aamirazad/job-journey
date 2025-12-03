import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { extractRouterConfig } from "uploadthing/server";
import { CSPostHogProvider } from "@/app/_analytics/provider";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
	title: "Job Journey",
	description: "Find and post jobs",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<CSPostHogProvider>
			<html suppressHydrationWarning lang="en" className={GeistSans.variable}>
				<body className="relative flex min-h-screen flex-col">
					<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
					<NextTopLoader color="#3b82f6" showSpinner={false} />
					<Header />
					<div className="absolute top-0 left-0 -z-10 flex h-full w-full flex-col">
						<div className="w-full flex-1 bg-linear-to-b from-blue-100/10 to-blue-100/10" />
						<div className="w-full flex-1 bg-linear-to-b from-blue-100/10 to-blue-100/10" />
						<div className="w-full flex-1 bg-linear-to-b from-blue-100/10 to-blue-100/30" />
						<div className="w-full flex-1 bg-linear-to-b from-blue-100/30 to-blue-100/30" />
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
