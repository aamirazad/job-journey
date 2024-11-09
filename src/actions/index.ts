"use server";

import { LoginSchema, SignUpSchema } from "@/app/schemas";
import type { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function signup(values: z.infer<typeof SignUpSchema>) {
  const validatedFields = SignUpSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "User already exists" };
  }

  await db.insert(users).values({ name, email, password: hashedPassword });

  return { sucess: "Account created" };
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email)

  if (!user) {
    return { error: "User not found" };
  }

  const hashedPassword = await hash(password, 10);

  if (hashedPassword != user.password) {
    return { error: "Incorrect password" };
  }

  console.log(validatedFields);
  return { sucess: "Sucess" };
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    return user;
  } catch {
    return null;
  }
}
