"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Session } from "next-auth";
import { USER_ROLES_WITHOUT_ADMIN } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserSettings } from "@/actions/actions";
import { toast } from "sonner";
import { FormInfo } from "@/components/auth/form-info";
import { capitalizefrstLetter } from "@/lib/utils";

export const SettingsSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "This is not a valid email address.",
  }),
  role: z.enum(USER_ROLES_WITHOUT_ADMIN, {
    message: "Role is required",
  }),
});

export default function Settings({ session }: { session: Session }) {
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      role: session.user.role === "ADMIN" ? "STUDENT" : session.user.role,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await setUserSettings(values).then((data) => {
      if (data.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="space-y-2">
                    {session.user.role === "ADMIN" ? (
                      <FormInfo message="You are an admin. You can change your role to a different type, but you will not be able to change it back." />
                    ) : null}
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  {USER_ROLES_WITHOUT_ADMIN.map((role) => (
                    <SelectItem key={role} value={role}>
                      {capitalizefrstLetter(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
