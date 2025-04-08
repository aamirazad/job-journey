import { PostJob } from "@/components/jobs/post-job";
import { LargeFormWrapper } from "@/components/large-form-wrapper";
import { auth } from "@/server/auth";
import type { JobPost } from "@/server/db/schema";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    prefill?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  if (resolvedSearchParams.prefill === "true") {
    const adventureGuidePost = {
      title: "Adventure Guide",
      company: "Explore More Expeditions",
      location: "Hershey, PA (and surrounding areas!)",
      employmentType: "Part-time",
      workplaceType: "On-site",
      experienceLevel: "Entry",
      pay: "$16 - $20 per hour",
      description:
        "Do you love being outside and showing people cool things? Explore More Expeditions wants fun and energetic Awesome Adventure Guides to help lead small groups on exciting local adventures! You could be guiding nature walks, helping with simple outdoor activities, and making sure everyone has a great time.",
      requirements:
        "Must enjoy being outdoors in different kinds of weather, be friendly and good at talking to people, and be able to follow instructions. Knowing some cool facts about nature in Pennsylvania is a bonus!",
      responsibilities:
        "Help set up for activities, guide small groups on trails and point out interesting things, make sure everyone stays safe and has fun, and help clean up afterwards.",
      benefits:
        "Getting to spend lots of time outdoors, meeting new people, and learning more about nature!",
    };
    console.log("prefilling");
    return (
      <LargeFormWrapper
        header="Post a New Job"
        description="Your post will need to be appoved before it is public"
      >
        <PostJob defaultPostDetails={adventureGuidePost} session={session} />
      </LargeFormWrapper>
    );
  }

  return (
    <LargeFormWrapper
      header="Post a New Job"
      description="Your post will need to be appoved before it is public"
    >
      <PostJob session={session} />
    </LargeFormWrapper>
  );
}
