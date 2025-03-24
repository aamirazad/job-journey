import { JobSearch } from "@/components/jobs/job-search";
import LoadingSpinner from "@/components/loading-spinner";
import { Suspense } from "react";

export default async function FindJobs() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <JobSearch />
        </Suspense>
    );
}
