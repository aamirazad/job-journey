import { getJobPost } from "@/actions/actions";
import BodyMessage from "@/components/body-message";
import { PostJob } from "@/components/jobs/post-job";
import { LargeFormWrapper } from "@/components/large-form-wrapper";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  const post = await getJobPost(Number(id));

  if (!post) {
    return <BodyMessage>Post not found</BodyMessage>;
  }

  return (
    <LargeFormWrapper
      header="Edit your job post"
      description="Your job post will need to be rereviewed before it is public"
    >
      <PostJob session={session} defaultPostDetails={post} />
    </LargeFormWrapper>
  );
}
