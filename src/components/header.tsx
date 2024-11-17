import { buttonVariants } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <GraduationCap className="h-6 w-6" />
        <span className="sr-only">Student Job Portal</span>
      </Link>
      <nav className="ml-auto flex gap-4">
        <Link
          className={buttonVariants({ variant: "link" })}
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className={buttonVariants({ variant: "link" })}
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className={buttonVariants({ variant: "link" })}
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className={buttonVariants({ variant: "default" })}
          href="/auth/signup"
        >
          Signup
        </Link>
      </nav>
    </header>
  );
}
