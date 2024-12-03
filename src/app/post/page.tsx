import { PostJob } from "@/components/jobs/post-job";
import { LargeFormWrapper } from "@/components/large-form-wrapper";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function PostPage() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
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
