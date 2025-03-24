import type { JobPost } from "@/server/db/schema";
import JobCard from "./job-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobListProps {
  jobs: JobPost[];
  onSelectJob: (job: JobPost) => void;
  selectedJob: number | undefined;
}

export default function JobList({
  jobs,
  onSelectJob,
  selectedJob,
}: JobListProps) {
  return (
    <div className="relative">
      <ScrollArea className="h-[calc(90vh-80px)] p-4">
        <h2 className="mt-5 mb-4 text-2xl font-bold">Job Listings</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              selected={job.postId === selectedJob}
              key={job.postId}
              job={job}
              onSelect={() => onSelectJob(job)}
            />
          ))}
        </div>
      </ScrollArea>
      {/* Fade in */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-16 bg-gradient-to-t from-transparent to-white" />
      {/* Fade out */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-36 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
