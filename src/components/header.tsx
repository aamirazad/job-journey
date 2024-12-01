import { Button, buttonVariants } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, signOut } from "@/server/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User } from "lucide-react";
import Image from "next/image";

async function UserDialog() {
  const session = await auth();
  if (!session) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="border-primary">
            {session.user.image ? (
              <Image
                src={session.user.image}
                width={32}
                height={32}
                priority={true}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            ) : (
              <User className="h-6 w-8" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {session.user.name ? session.user.name : <>My Account</>}{" "}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                "use server";
                await signOut();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <GraduationCap className="h-6 w-6" />
        <span className="sr-only">Student Job Portal</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4">
        <Link className={buttonVariants({ variant: "link" })} href="/jobs">
          Find jobs
        </Link>
        <Link className={buttonVariants({ variant: "link" })} href="/post">
          Post a Job
        </Link>
        {session?.user.role === "ADMIN" ? (
          <Link className={buttonVariants({ variant: "link" })} href="/admin">
            Admin
          </Link>
        ) : null}

        {session ? (
          <UserDialog />
        ) : (
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}
