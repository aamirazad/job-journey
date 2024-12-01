import { getPostNameFromId } from "@/actions/actions";
import FormWrapper from "@/components/auth/form-wrapper";
import BodyMessage from "@/components/body-message";
import ApplicationForm from "@/components/jobs/application-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ postId: number }>;
}) {
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  if (session.user.role == "EMPLOYER") {
    return <BodyMessage>Employers can not apply for job postings</BodyMessage>;
  }

  const postId = (await params).postId;
  const post = await getPostNameFromId(postId);
  if (!post) {
    return <BodyMessage>Post not found</BodyMessage>;
  }

  return (
    <FormWrapper header={post?.title}>
      <ApplicationForm postId={postId} />
    </FormWrapper>
  );
}
