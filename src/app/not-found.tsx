import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="m-64 flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center px-4 text-center md:px-6">
        <GraduationCap className="mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-8 text-4xl font-bold tracking-tighter sm:text-4xl md:text-6xl lg:text-5xl/none">
          404 - Page Not Found
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
