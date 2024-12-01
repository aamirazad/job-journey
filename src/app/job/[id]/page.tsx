import { getJobPost } from "@/actions/actions";
import BodyMessage from "@/components/body-message";
import { DetailedJobPost } from "@/components/jobs/detailed-post";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getJobPost(Number(id));
  if (!post) return <BodyMessage>Post not found</BodyMessage>;
  return <DetailedJobPost post={post} />;
}
