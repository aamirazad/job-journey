import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="h-full items-center justify-center">
      <section className="w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Dream Job
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Connect with employers and find career opportunities tailored
                for you
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form
                className="flex w-full max-w-md flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
                action="/jobs"
              >
                <Input
                  className="flex-1"
                  placeholder="Search jobs..."
                  type="search"
                  name="search"
                />
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
