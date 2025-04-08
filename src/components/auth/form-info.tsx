import { Info } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export function FormInfo({ message }: FormSuccessProps) {
  if (!message) {
    return null;
  }
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-blue-500/15 p-3 text-sm text-blue-500">
      <Info className="h-4 w-4 flex-none" />
      <p className="shrink">{message}</p>
    </div>
  );
}
