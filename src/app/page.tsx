import {
	Briefcase,
	CheckCircle,
	GraduationCap,
	Search,
	Wand,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PostHogId } from "@/components/id-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/server/auth";

export default async function HomePage() {
	const session = await auth();
	const features = [
		{
			icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
			title: "Student-Focused",
			description: "Designed specifically for students",
		},
		{
			icon: <Briefcase className="h-8 w-8 text-green-600" />,
			title: "Diverse Opportunities",
			description:
				"Internships, part-time, and full-time roles across industries",
		},
		{
			icon: <Wand className="h-8 w-8 text-purple-600" />,
			title: "Easy to use",
			description:
				"Finding a job should not be stressful; we make it fun and easy.",
		},
	];

	return (
		<div className="items-cener min-h-screen">
			{session ? (
				<Suspense>
					<PostHogId session={session} />
				</Suspense>
			) : null}
			<section className="relative overflow-hidden pt-16 pb-12 md:pt-24 lg:pt-32">
				<div className="container mx-auto px-4 md:px-6">
					<div className="grid items-center gap-8 md:grid-cols-2">
						<div className="space-y-6 text-center md:text-left">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
									Kickstart Your Career Journey
								</h1>
								<p className="max-w-xl text-xl text-gray-600 dark:text-gray-300">
									Bridging talented students with innovative employers. Your
									next great opportunity starts here.
								</p>
							</div>

							<form
								className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row md:mx-0"
								action="/jobs"
							>
								<Input
									className="flex-1"
									placeholder="Search jobs, internships, companies..."
									type="search"
									name="search"
								/>
								<Button type="submit" className="w-full sm:w-auto">
									<Search className="mr-2 h-4 w-4" />
									Find Opportunities
								</Button>
							</form>
						</div>

						<div className="hidden items-center justify-center md:flex">
							<div className="relative w-full max-w-md">
								<Image
									src="https://utfs.io/f/54iPPKBOVfGC5WLmnOVfGCKdM7FkuBEW2UsIR0YhoONQ356z"
									width={2000}
									height={1333}
									placeholder="blur"
									blurDataURL="data:image/webp;base64,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"
									alt="Career opportunities"
									className="relative z-10 transform rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
								/>
								<div className="mt-2 text-center text-xs text-gray-500">
									Photo by{" "}
									<a
										href="https://unsplash.com/@campaign_creators?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
										target="_blank"
										rel="noopener noreferrer"
										className="underline hover:text-blue-600"
									>
										Campaign Creators
									</a>{" "}
									on{" "}
									<a
										href="https://unsplash.com/photos/man-standing-in-front-of-people-sitting-beside-table-with-laptop-computers-gMsnXqILjp4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
										target="_blank"
										rel="noopener noreferrer"
										className="underline hover:text-blue-600"
									>
										Unsplash
									</a>
									<div className="pointer-events-none absolute inset-0 -m-12 rotate-12 rounded-full bg-blue-200 opacity-30"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="container mx-auto px-4 md:px-6">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold text-gray-900">
							Why Choose Our Platform?
						</h2>
						<p className="mx-auto max-w-2xl text-gray-600">
							We&apos;re more than just a job board. We&apos;re a comprehensive
							career development ecosystem for students.
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{features.map((feature, index) => (
							<div
								key={index}
								className="rounded-xl bg-gray-50 p-6 text-center transition-shadow duration-300 hover:shadow-lg"
							>
								<div className="mb-4 flex justify-center">{feature.icon}</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="clipped mx-auto max-w-4xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 py-16 text-white shadow-lg">
				<div className="px-4 text-center md:px-6">
					<div className="mx-auto space-y-6">
						<h2 className="text-4xl font-bold">Ready to Take the Next Step?</h2>
						<p className="text-xl opacity-90">
							Create your profile, showcase your skills, and connect with top
							employers.
						</p>
						<div className="flex justify-center space-x-4">
							<Button
								variant="secondary"
								size="lg"
								className="bg-white text-blue-500 shadow-md hover:bg-gray-300"
								asChild
							>
								<Link href="/auth/signup">Create account</Link>
							</Button>
							<Button
								variant="secondary"
								size="lg"
								className="bg-white text-blue-500 shadow-md hover:bg-gray-300"
								asChild
							>
								<Link href="jobs">Browse Jobs</Link>
							</Button>
						</div>
						<div className="mt-6 flex items-center justify-center space-x-4">
							<CheckCircle className="h-6 w-6 text-green-400" />
							<span>100% Free for Students</span>
							<CheckCircle className="h-6 w-6 text-green-400" />
							<span>No Hidden Fees</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
