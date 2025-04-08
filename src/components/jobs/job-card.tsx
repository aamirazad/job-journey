import type { JobPost } from "@/server/db/schema";

interface JobCardProps {
  job: JobPost;
  onSelect: () => void;
  selected: boolean;
}

export default function JobCard({ job, onSelect, selected }: JobCardProps) {
  return (
    <div
      className={`group relative cursor-pointer px-4 py-4 transition-colors ${selected ? "bg-blue-50" : ""} hover:bg-blue-50`}
      onClick={onSelect}
    >
      <div
        className={`absolute top-0 bottom-0 left-0 w-1 bg-blue-500 opacity-0 transition-opacity ${selected ? "opacity-100" : ""} group-hover:opacity-100`}
      />
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
      <p className="mt-2 text-sm text-gray-500">{job.pay}</p>
    </div>
  );
}
