import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 pt-12">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Student Job Portal. All rights reserved.
        </p>
        <nav className="mt-4 flex gap-4 sm:mt-0 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/sources"
            className="text-xs underline-offset-4 hover:underline"
          >
            Sources
          </Link>
        </nav>
      </div>
    </footer>
  );
}
