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
import { type JobPost } from "@/server/db/schema";

export function DetailedJobPost({ post }: { post: JobPost }) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
            <p className="mt-1 text-muted-foreground">{post.company}</p>
          </div>
          {post.status === "UNREVIEWED" ? (
            <Badge className="pointer-events-none" variant="warning">
              Unreviewed
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{post.location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{post.employmentType}</span>
          </div>
          {post.workplaceType && (
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{post.workplaceType}</span>
            </div>
          )}
          {post.experienceLevel && (
            <div className="flex items-center">
              <Award className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{post.experienceLevel}</span>
            </div>
          )}
          {(post.salaryMin ?? post.salaryMax) && (
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {post.salaryMin && `$${post.salaryMin.toLocaleString()}`}
                {post.salaryMin && post.salaryMax && " - "}
                {post.salaryMax && `$${post.salaryMax.toLocaleString()}`}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <FileText className="mr-2 h-5 w-5" />
            Job Description
          </h3>
          <p className="whitespace-pre-line text-muted-foreground">
            {post.description}
          </p>
        </div>

        {post.requirements && (
          <div>
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <CheckSquare className="mr-2 h-5 w-5" />
              Requirements
            </h3>
            <p className="whitespace-pre-line text-muted-foreground">
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
            <p className="whitespace-pre-line text-muted-foreground">
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
            <p className="whitespace-pre-line text-muted-foreground">
              {post.benefits}
            </p>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Posted on {post.dateCreated.toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
