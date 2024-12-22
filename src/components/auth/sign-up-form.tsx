"use client";

import FormWrapper from "./form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import { SignUpSchema } from "@/schemas";
import { signup } from "@/actions/auth";
import { useState, useTransition } from "react";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES_WITHOUT_ADMIN } from "@/schemas";
import { redirect } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignUpForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isHidden, setIsHidden] = useState(false);
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      role: "STUDENT",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError("");
    setsuccess("");

    startTransition(async () => {
      await signup(values).then((data) => {
        setError(data.error);
        if (data.success) {
          setsuccess(data.success);
          setTimeout(() => {
            redirect("/auth/login");
          }, 1000);
        }
      });
    });
  };

  return (
    <FormWrapper
      header="Sign up"
      description="Create an account to get started"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      click="Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" disabled={isPending} />
                  </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_ROLES_WITHOUT_ADMIN.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input
                      {...field}
                      placeholder="john@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-shrink items-center space-x-2">
                      <Input type={isHidden ? "text" : "password"} {...field} />
                      {isHidden ? (
                        <EyeIcon
                          onClick={() => setIsHidden(false)}
                          aria-description="Show password"
                        />
                      ) : (
                        <EyeOffIcon
                          onClick={() => setIsHidden(true)}
                          aria-description="Hide password"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="flex flex-shrink items-center space-x-2">
                      <Input type={isHidden ? "text" : "password"} {...field} />
                      {isHidden ? (
                        <EyeIcon
                          onClick={() => setIsHidden(false)}
                          aria-description="Show password"
                        />
                      ) : (
                        <EyeOffIcon
                          onClick={() => setIsHidden(true)}
                          aria-description="Hide password"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Sign up
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
