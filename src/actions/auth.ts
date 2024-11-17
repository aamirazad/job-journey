"use server";

import { LoginSchema, SignUpSchema } from "@/schemas";
import type { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/server/db";
import { users, USER_ROLES } from "@/server/db/schema";
import { signIn } from "@/server/auth/index";
import { DEFUALT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/actions/data";

export async function signup(values: z.infer<typeof SignUpSchema>) {
  const validatedFields = SignUpSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, role, email, password } = validatedFields.data;

  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists" };
  }

  if (!USER_ROLES.includes(role)) {
    return { error: "Invalid role" };
  }

  await db
    .insert(users)
    .values({ name, email, role, password: hashedPassword });

  return { success: "Account created" };
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFUALT_LOGIN_REDIRECT,
    });
    if (res) {
      return { success: "success" };
    } else {
      return { error: "Invalid credentials" };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
