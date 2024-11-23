export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const slug = (await params).id;
  return <div>My Post: {slug}</div>;
}
