import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormWrapperProps {
  children: React.ReactNode;
  header?: string;
  description?: string;
}

export function LargeFormWrapper({
  children,
  header,
  description,
}: FormWrapperProps) {
  return (
    <Card className="mx-auto max-w-7xl bg-white/50">
      <CardHeader>
        <CardTitle className="text-2xl">{header}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
