import DetailedJobPost from "@/components/jobs/detailed-post";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailedJobPost postId={Number(id)} />;
}
