import PostJob from "@/components/post-job";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function PostPage() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  return <PostJob {...session} />;
}
