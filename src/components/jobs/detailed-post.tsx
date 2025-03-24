"use client";

import {
  CalendarDays,
  Briefcase,
  MapPin,
  Building,
  Award,
  DollarSign,
  FileText,
  CheckSquare,
  List,
  Gift,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BodyMessage from "../body-message";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import MapBoxLocation from "../map-box";
import type { JobPost } from "@/server/db/schema";

export function DetailedJobPost({ post }: { post: JobPost }) {
  if (!post) return <BodyMessage>Post not found</BodyMessage>;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-auto">
            <CardTitle className="text-2xl font-bold break-words">
              {post.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1 break-words">
              {post.company}
            </p>
          </div>
          {post.status === "UNREVIEWED" && (
            <Badge className="flex-none whitespace-nowrap">Unreviewed</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center break-words">
            <MapPin className="text-muted-foreground mr-2 h-4 w-4 flex-none" />
            <span className="break-all">{post.location}</span>
          </div>
          <div className="flex items-center break-words">
            <Briefcase className="text-muted-foreground mr-2 h-4 w-4 flex-none" />
            <span className="break-all">{post.employmentType}</span>
          </div>
          {post.workplaceType && (
            <div className="flex items-center break-words">
              <Building className="text-muted-foreground mr-2 h-4 w-4 flex-none" />
              <span className="break-all">{post.workplaceType}</span>
            </div>
          )}
          {post.experienceLevel && (
            <div className="flex items-center break-words">
              <Award className="text-muted-foreground mr-2 h-4 w-4 flex-none" />
              <span className="break-all">{post.experienceLevel}</span>
            </div>
          )}
          {post.pay && (
            <div className="flex items-center break-words">
              <DollarSign className="text-muted-foreground mr-2 h-4 w-4 flex-none" />
              <span className="break-all">{post.pay}</span>
            </div>
          )}
        </div>

        <MapBoxLocation location={post.location} />

        <Separator />

        <div>
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <FileText className="mr-2 h-5 w-5" />
            Job Description
          </h3>
          <p className="text-muted-foreground break-words whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {post.requirements && (
          <div>
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <CheckSquare className="mr-2 h-5 w-5" />
              Requirements
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {post.requirements}
            </p>
          </div>
        )}

        {post.responsibilities && (
          <div>
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <List className="mr-2 h-5 w-5" />
              Responsibilities
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {post.responsibilities}
            </p>
          </div>
        )}

        {post.benefits && (
          <div>
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <Gift className="mr-2 h-5 w-5" />
              Benefits
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {post.benefits}
            </p>
          </div>
        )}

        <Separator />

        <div className="text-muted-foreground flex justify-between text-sm">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Posted on {post.dateCreated.toLocaleDateString()}
          </div>
        </div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/apply/${post.postId}`}
        >
          Apply
        </Link>
      </CardContent>
    </Card>
  );
}
