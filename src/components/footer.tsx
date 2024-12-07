export default function Footer() {
  return (
    <footer className="border-t py-6 pt-12">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Student Job Portal. All rights reserved.
        </p>
        <nav className="mt-4 flex gap-4 sm:mt-0 sm:gap-6">
          <a
            href="/terms"
            className="text-xs underline-offset-4 hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-xs underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
