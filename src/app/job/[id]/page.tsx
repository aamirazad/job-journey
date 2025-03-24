import { getJobPost } from "@/actions/actions";
import BodyMessage from "@/components/body-message";
import { DetailedJobPost } from "@/components/jobs/detailed-post";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const JobPost = await getJobPost(Number(id));
  if (!JobPost) {
    return <BodyMessage>Post not found</BodyMessage>;
  }
  return <DetailedJobPost post={JobPost} />;
}
