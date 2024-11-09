"use server";

import { LoginSchema, SignUpSchema } from "@/app/schemas";
import type { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function signup(values: z.infer<typeof SignUpSchema>) {
  const validatedFields = SignUpSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  await db.insert(users).values({name, email, password: hashedPassword})

  return { sucess: "Account created" };
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields) {
    return { error: "Invalid fields" };
  }
  console.log(validatedFields);
  return { sucess: "Sucess" };
}
