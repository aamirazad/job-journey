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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const queryClient = new QueryClient();

const formSchema = z.object({
  search: z.string(),
});

function Filters() {
  const [search, setSearch] = useQueryState("search");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Card className="h-fit flex-none bg-white/10">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Search" onChangeCapture={e => setSearch(e.target.value)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Listings() {
  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: getJobPosts,
  });

  if (posts.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.data?.map((job) => (
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
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Explore Job Opportunities</h1>
      <div className="mt-8 flex gap-8">
        <Filters />
        <QueryClientProvider client={queryClient}>
          <Listings />
        </QueryClientProvider>
      </div>
    </div>
  );
}
