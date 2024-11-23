"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getJobPosts } from "@/actions/data";
import LoadingSpinner from "@/components/loading-spinner";

const queryClient = new QueryClient();

function Listings() {
  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: getJobPosts,
  });

  if (posts.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {posts.data?.map((job) => (
        <Card key={job.postId} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
            <p className="text-lg font-semibold text-muted-foreground">
              {job.company}
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.workplaceType}</span>
              </div>
              {job.salaryMax && job.salaryMin ? (
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    ${job.salaryMin.toLocaleString()} - $
                    {job.salaryMax.toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="mt-4">
              <Badge variant="secondary">{job.experienceLevel}</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/job/${job.postId}`}>
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default function JobListings() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Explore Job Opportunities</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QueryClientProvider client={queryClient}>
          <Listings />
        </QueryClientProvider>
      </div>
    </div>
  );
}
