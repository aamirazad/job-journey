"use server";

import { db } from "@/server/db";
import { unstable_cache } from "next/cache";

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

export const getJobPosts = unstable_cache(async () => {
  try {
    const posts = await db.query.posts.findMany();
    return posts;
  } catch {
    return null;
  }
});
