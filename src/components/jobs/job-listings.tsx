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
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { type EmploymentType, employmentTypeValues } from "@/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { set } from "zod";

const queryClient = new QueryClient();

interface ListingsProps {
  search?: string;
  employmentTypes?: EmploymentType[];
}
function Listings({ search, employmentTypes }: ListingsProps) {
  // Fetch all job posts using react-query and cache them locally
  const {
    data: jobPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getJobPosts,
  });

  // Local state to store filtered job posts
  const [posts, setPosts] = useState<typeof jobPosts>([]);

  // Filter job posts whenever search, employmentTypes, or jobPosts change
  useEffect(() => {
    const filterJobPosts = () => {
      if (!jobPosts) return [];

      return jobPosts.filter((job) => {
        // Filter by search term (case-insensitive match for the title)
        const matchesSearch = search
          ? job.title.toLowerCase().includes(search.toLowerCase())
          : true;

        // Filter by employmentTypes if provided
        const matchesEmploymentType =
          employmentTypes && employmentTypes.length > 0
            ? employmentTypes.includes(job.employmentType as EmploymentType)
            : true;

        // Return true only if both conditions match
        return matchesSearch && matchesEmploymentType;
      });
    };

    setPosts(filterJobPosts()); // Apply filter after every change
  }, [search, employmentTypes, jobPosts]); // Re-run the effect when any of these values change

  // Loading state while data is being fetched
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Error fetching job posts.</p>;
  }

  // Handle case where no posts are found
  if (!posts || posts.length === 0) {
    return <p>No job posts found matching your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((job) => (
        <Card key={job.postId} className="flex flex-col bg-white/50">
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
    </div>
  );
}

export default function JobListings() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [employmentTypes, setEmploymentTypes] = useQueryState<EmploymentType[]>(
    "employmentTypes",
    {
      defaultValue: [],
      parse: (value): EmploymentType[] => {
        if (!value) return [];
        const types = value.split(",") as EmploymentType[];
        return types.filter((type) => employmentTypeValues.includes(type));
      },
      serialize: (value) => value.join(","),
    },
  );

  const handleCheckedChange = async (type: EmploymentType) => {
    if (employmentTypes.includes(type)) {
      await setEmploymentTypes(employmentTypes.filter((t) => t !== type));
    } else {
      await setEmploymentTypes([...employmentTypes, type]);
    }
  };

  const clearAll = () => {
    void setSearch(null);
    void setEmploymentTypes([]);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Explore Job Opportunities</h1>
      <div className="mt-8 flex gap-8">
        <Card className="h-fit flex-none bg-white/10">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex-col space-y-4">
              <Input
                value={search || ""}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-4">
                  {employmentTypeValues.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={employmentTypes.includes(type)}
                        onCheckedChange={() => handleCheckedChange(type)}
                      />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-24" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
        <QueryClientProvider client={queryClient}>
          <Listings search={search} employmentTypes={employmentTypes} />
        </QueryClientProvider>
      </div>
    </div>
  );
}
