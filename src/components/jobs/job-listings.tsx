"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { getReviewedJobPosts } from "@/actions/actions";
import LoadingSpinner from "@/components/loading-spinner";
import BodyMessage from "../body-message";
import { DetailedJobPost } from "./detailed-post";
import JobList from "./job-list";
import type { JobPost } from "@/server/db/schema";
import type { SearchFilters } from "@/schemas";
import { useRef, useState } from "react";
import { JobRecommendation } from "./job-recommendation";
import { ScrollArea } from "../ui/scroll-area";

const queryClient = new QueryClient();

interface JobListingsProps {
  filters: SearchFilters | null;
}

function App({ filters }: JobListingsProps) {
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const JobPostRef = useRef(null);

  const { data: jobPosts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getReviewedJobPosts,
  });

  const filteredJobs =
    Array.isArray(jobPosts) && !isLoading
      ? jobPosts.filter((job: JobPost) => {
          const searchQuery = filters?.search?.toLowerCase() ?? ""; // Ensure safe access
          const matchesSearch =
            searchQuery === "" ||
            job.title.toLowerCase().includes(searchQuery) ||
            job.company.toLowerCase().includes(searchQuery);

          const matchesType =
            Array.isArray(filters?.employmentTypes) &&
            filters.employmentTypes.length > 0
              ? filters.employmentTypes.includes(job.employmentType)
              : true;

          return matchesSearch && matchesType;
        })
      : [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (jobPosts instanceof Error) {
    return (
      <BodyMessage className="text-center">{jobPosts.message}</BodyMessage>
    );
  }

  return (
    <div className="w-full md:flex-1">
      {filteredJobs.length === 0 ? (
        <BodyMessage className="text-center">
          No job posts found matching your criteria.
        </BodyMessage>
      ) : (
        <div className="flex flex-col gap-6 md:flex-row">
          <ScrollArea className="h-[calc(90vh-80px)] md:w-1/2">
            <JobList
              jobs={filteredJobs}
              onSelectJob={setSelectedJob}
              selectedJob={selectedJob?.postId}
            />
          </ScrollArea>
          <div
            ref={JobPostRef}
            className="h-64 overflow-y-auto md:h-screen md:w-2/3"
          >
            {selectedJob ? (
              <DetailedJobPost post={selectedJob} />
            ) : (
              <JobRecommendation />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function JobListings({ filters }: JobListingsProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <App filters={filters} />
    </QueryClientProvider>
  );
}
