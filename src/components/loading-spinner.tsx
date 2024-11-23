import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function LoadingSpinner({
  children,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-row place-content-center gap-1", className)}>
      <LoaderCircle className="animate-spin" />
      {children}
    </div>
  );
}
