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
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-auto">
            <CardTitle className="break-words text-2xl font-bold">
              {post.title}
            </CardTitle>
            <p className="mt-1 break-words text-muted-foreground">
              {post.company}
            </p>
          </div>
          {post.status === "UNREVIEWED" && (
            <Badge
              className="pointer-events-none flex-none whitespace-nowrap"
              variant="warning"
            >
              Unreviewed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center break-words">
            <MapPin className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
            <span className="break-all">{post.location}</span>
          </div>
          <div className="flex items-center break-words">
            <Briefcase className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
            <span className="break-all">{post.employmentType}</span>
          </div>
          {post.workplaceType && (
            <div className="flex items-center break-words">
              <Building className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
              <span className="break-all">{post.workplaceType}</span>
            </div>
          )}
          {post.experienceLevel && (
            <div className="flex items-center break-words">
              <Award className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
              <span className="break-all">{post.experienceLevel}</span>
            </div>
          )}
          {post.pay && (
            <div className="flex items-center break-words">
              <DollarSign className="mr-2 h-4 w-4 flex-none text-muted-foreground" />
              <span className="break-all">{post.pay}</span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <FileText className="mr-2 h-5 w-5" />
            Job Description
          </h3>
          <p className="whitespace-pre-line break-words text-muted-foreground">
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
