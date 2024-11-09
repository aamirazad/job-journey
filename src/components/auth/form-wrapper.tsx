import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormWrapperProps {
  children: React.ReactNode;
  intent: string;
}

export default function FormWrapper({ children, intent }: FormWrapperProps) {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{intent}</CardTitle>
        <CardDescription>
          Enter your email below to {intent.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
