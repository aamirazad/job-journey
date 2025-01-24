"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
  Menu,
} from "lucide-react";
import Link from "next/link";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getReviewedJobPosts } from "@/actions/actions";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { type EmploymentType, employmentTypeValues } from "@/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type { Session } from "next-auth";
import BodyMessage from "../body-message";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JobRecommendation } from "./job-recommendation";

const queryClient = new QueryClient();

interface ListingsProps {
  search?: string;
  employmentTypes?: EmploymentType[];
  session: Session | null;
}

function Listings({ search, employmentTypes, session }: ListingsProps) {
  // Fetch all job posts using react-query and cache them locally
  const { data: jobPosts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getReviewedJobPosts,
  });

  // Local state to store filtered job posts
  const [posts, setPosts] = useState<typeof jobPosts>([]);

  // Filter job posts whenever search, employmentTypes, or jobPosts change
  useEffect(() => {
    const filterJobPosts = () => {
      if (!jobPosts || jobPosts instanceof Error) return jobPosts;

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

  if (posts instanceof Error) {
    return <BodyMessage className="text-center">{posts.message}</BodyMessage>;
  }

  // Handle case where no posts are found
  if (!posts || posts.length === 0) {
    return (
      <BodyMessage className="text-center">
        No job posts found matching your criteria.
      </BodyMessage>
    );
  }

  return (
    <div className="grid w-full gap-4">
      <JobRecommendation jobPosts={posts} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((job) => (
          <Card key={job.postId} className="flex flex-col bg-white/50">
            <CardHeader>
              <CardTitle className="overflow-hidden truncate text-ellipsis text-xl font-bold sm:text-2xl">
                {job.title}
              </CardTitle>
              <p className="overflow-hidden truncate text-ellipsis text-base font-semibold text-muted-foreground sm:text-lg">
                {job.company}
              </p>
            </CardHeader>
            <CardContent className="grow">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
                  <span className="overflow-hidden truncate text-ellipsis text-sm sm:text-base">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
                  <span className="overflow-hidden truncate text-ellipsis text-sm sm:text-base">
                    {job.employmentType}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
                  <span className="overflow-hidden truncate text-ellipsis text-sm sm:text-base">
                    {job.workplaceType}
                  </span>
                </div>
                {job.pay && job.pay ? (
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
                    <span className="overflow-hidden truncate text-ellipsis text-sm sm:text-base">
                      {job.pay.toLocaleString()}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="mt-4">
                <Badge
                  variant="secondary"
                  className="pointer-events-none line-clamp-1 inline-block text-xs sm:text-sm"
                >
                  {job.experienceLevel}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-2">
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/job/${job.postId}`}>
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {session?.user?.role &&
              ["STUDENT", "ADMIN"].includes(session.user.role) ? (
                <Link
                  className={`${buttonVariants({ variant: "outline" })} w-full sm:w-auto`}
                  href={`/apply/${job.postId}`}
                >
                  Apply
                </Link>
              ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function JobListings({ session }: { session: Session | null }) {
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

  // Mobile filter sheet state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Explore Job Opportunities
      </h1>

      {/* Mobile Filter Toggle */}
      <div className="mb-4 block md:hidden">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Menu className="mr-2 h-4 w-4" /> Filter Jobs
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Job Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <Input
                value={search || ""}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
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
              <div className="mt-4 flex justify-between">
                <Button onClick={clearAll} variant="outline">
                  Clear Filters
                </Button>
                <Button onClick={() => setIsFilterSheetOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Desktop Filters */}
        <Card className="hidden h-fit w-full max-w-[250px] flex-none bg-white/10 md:block">
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
              <Button className="w-full" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
        <QueryClientProvider client={queryClient}>
          <Listings
            search={search}
            employmentTypes={employmentTypes}
            session={session}
          />
        </QueryClientProvider>
      </div>
    </div>
  );
}
