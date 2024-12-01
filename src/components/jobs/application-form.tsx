"use client";

import { ApplicationFormSchema } from "@/schemas";
import { UploadDropzone } from "@/utils/uploadthing";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { handleJobApplication } from "@/actions/actions";

export default function ApplicationForm({ postId }: { postId: number }) {
  const form = useForm<z.infer<typeof ApplicationFormSchema>>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      resumeId: "",
      coverLetterId: "",
    },
  });

  // Function to update form values when file is uploaded
  const updateFormValue = (
    fieldName: "resumeId" | "coverLetterId",
    value: string,
  ) => {
    form.setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  async function onSubmit(values: z.infer<typeof ApplicationFormSchema>) {
    // Now the form values include the PDF links
    const result = await handleJobApplication(values, postId);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Application posted!");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resumeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              <FormControl>
                {!field.value ? (
                  <UploadDropzone
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                      const link = res[0]?.key;
                      if (link) {
                        updateFormValue("resumeId", link);
                        toast.success(`Resume uploaded successfully`);
                      }
                    }}
                    onUploadError={() => {
                      toast.error("Error uploading resume");
                    }}
                  />
                ) : (
                  <a
                    href={`https://utfs.io/f/${field.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-4 text-sm font-medium text-gray-700 shadow-sm transition duration-150 hover:bg-gray-200 hover:text-gray-900"
                  >
                    <span className="truncate">Uploaded Resume</span>
                    <ArrowRight />
                  </a>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                {!field.value ? (
                  <UploadDropzone
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                      const link = res[0]?.key;
                      if (link) {
                        updateFormValue("coverLetterId", link);
                        toast.success(`Cover letter uploaded successfully`);
                      }
                    }}
                    onUploadError={() => {
                      toast.error("Error uploading cover letter");
                    }}
                  />
                ) : (
                  <a
                    href={`https://utfs.io/f/${field.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-4 text-sm font-medium text-gray-700 shadow-sm transition duration-150 hover:bg-gray-200 hover:text-gray-900"
                  >
                    <span className="truncate">Uploaded Cover Letter</span>
                    <ArrowRight />
                  </a>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
