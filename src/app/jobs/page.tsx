import JobListings from "@/components/jobs/job-listings";
import LoadingSpinner from "@/components/loading-spinner";
import { auth } from "@/server/auth";
import { Suspense } from "react";

export default async function FindJobs() {
  const session = await auth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobListings session={session} />
    </Suspense>
  );
}
