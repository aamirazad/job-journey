import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface FormWrapperProps {
  children: React.ReactNode;
  header: string;
  description: string;
  backButtonLabel: string;
  backButtonHref: string;
  click: string;
}

export default function FormWrapper({ children, header, description, backButtonLabel, backButtonHref, click }: FormWrapperProps) {
  return (
    <Card className="mx-auto max-w-sm bg-white/50">
      <CardHeader>
        <CardTitle className="text-2xl">{header}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
          {backButtonLabel} <Button variant="link" asChild><Link href={backButtonHref}>{click}</Link></Button>
      </CardFooter>
    </Card>
  );
}
