import { auth } from "@/server/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {session?.user.id}
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/signup">Create an account</Link>
      </div>
    </main>
  );
}
