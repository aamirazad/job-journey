"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BodyMessage from "@/components/body-message";
import { toast } from "sonner";
import { createJobPost } from "@/actions/actions";
import type { Session } from "next-auth";
import { useState } from "react";
import { type JobPost } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { jobPostSchema } from "@/schemas";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function PostForm({
  session,
  refreshPage,
  defaultPostDetails,
}: {
  session: Session;
  refreshPage: () => void;
  defaultPostDetails?: JobPost;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: defaultPostDetails?.title ?? "",
      company: defaultPostDetails?.company ?? "",
      location: defaultPostDetails?.location ?? "",
      employmentType: defaultPostDetails?.employmentType ?? "Full-time",
      workplaceType: defaultPostDetails?.workplaceType ?? "On-site",
      experienceLevel: defaultPostDetails?.experienceLevel ?? "Mid",
      pay: defaultPostDetails?.pay ?? "",
      description: defaultPostDetails?.description ?? "",
      requirements: defaultPostDetails?.requirements ?? "",
      responsibilities: defaultPostDetails?.responsibilities ?? "",
      benefits: defaultPostDetails?.benefits ?? "",
    },
  });

  if (!["EMPLOYER", "ADMIN"].includes(session.user.role)) {
    return (
      <BodyMessage>You are not authorized to create a job posting</BodyMessage>
    );
  }

  async function onSubmit(values: z.infer<typeof jobPostSchema>) {
    try {
      if (!session || !["EMPLOYER", "ADMIN"].includes(session.user.role)) {
        return { error: "Not authorized" };
      }
      const result = await createJobPost(values, defaultPostDetails?.postId);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Job post created successfully!");

      if (defaultPostDetails) {
        router.push("/post");
      }
      refreshPage();
    } catch {
      toast("Error posting job. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer" {...field} />
              </FormControl>
              <FormDescription>
                The title of the position you&apos;re hiring for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tech Innovators Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pay</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $70,000 - $100,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplaceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workplace type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any specific requirements or qualifications..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the main responsibilities of the role..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any benefits or perks offered with this position..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Job Posting</Button>
      </form>
    </Form>
  );
}

export function PostJob({
  session,
  defaultPostDetails,
}: {
  session: Session;
  defaultPostDetails?: JobPost;
}) {
  const [key, setKey] = useState(0);
  const refreshPage = () => {
    setKey((prevKey) => prevKey + 1);
  };
  return (
    <div key={key}>
      <PostForm
        session={session}
        refreshPage={refreshPage}
        defaultPostDetails={defaultPostDetails}
      />
    </div>
  );
}
