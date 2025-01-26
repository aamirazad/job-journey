"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { type JobPost } from "@/server/db/schema";
import Link from "next/link";
import { getAIRecommendations } from "@/actions/actions";
import { FormError } from "../auth/form-error";

export function JobRecommendation({ jobPosts }: { jobPosts: JobPost[] }) {
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  interface SingleRecommendation {
    id: number;
    reasoning: string;
  }

  const [recommendations, setRecommendations] = useState<
    SingleRecommendation[] | null | { error: string }
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendations(await getAIRecommendations(interests));
    setIsLoading(false);
  };

  return (
    <Card className="relative mx-auto w-full max-w-3xl overflow-hidden">
      <div className="absolute inset-0 rounded-lg bg-linear-to-r from-[#1f9ed3] via-[#4174db] to-[#7c2be8] opacity-75"></div>
      <CardHeader className="relative z-20">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
          <Sparkles className="h-6 w-6" />
          AI Job Matcher
        </CardTitle>
        <CardDescription className="text-gray-100">
          Describe what you are interested in and we will match the perfect job
          for you. Powered by AI, may contain occasional errors
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your interests and skills..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full border-white/10 bg-white/10 text-white ring-white placeholder:text-slate-200 focus-visible:ring-pink-300 focus-visible:outline-hidden"
          />
          <Button
            type="submit"
            className="w-full transform bg-white text-purple-600 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding perfect jobs...
              </>
            ) : (
              "Find My Perfect Jobs"
            )}
          </Button>
        </form>
      </CardContent>
      {recommendations === null ? null : "error" in recommendations ? (
        <CardFooter className="relative z-20 bg-white/10 backdrop-blur-xs">
          <FormError message={recommendations.error} />
        </CardFooter>
      ) : (
        <CardFooter className="relative z-20 bg-white/10 backdrop-blur-xs">
          <div className="w-full">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Recommended Jobs:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-white">
              {recommendations.map((rec, index) => {
                const matchedJob = jobPosts?.find(
                  (job) => job.postId === rec.id,
                );
                return (
                  <li
                    key={rec.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Link
                      className="font-bold hover:underline"
                      href={`/job/${rec.id}`}
                    >
                      {matchedJob?.title}
                    </Link>{" "}
                    – {rec.reasoning}
                  </li>
                );
              })}
            </ul>
          </div>
        </CardFooter>
      )}{" "}
    </Card>
  );
}
