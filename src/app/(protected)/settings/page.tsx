import { auth } from "@/server/auth";

export default async function UserAvatar() {
  const session = await auth();

  return <div>{JSON.stringify(session)}</div>;
}
