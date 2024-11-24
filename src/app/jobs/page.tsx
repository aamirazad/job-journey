import JobListings from "@/components/jobs/job-listings";
import LoadingSpinner from "@/components/loading-spinner";
import { Suspense } from "react";

export default function FindJobs() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobListings />
    </Suspense>
  );
}
