"use server";

import type { jobPostSchema } from "@/schemas";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import type { Session } from "next-auth";
import type * as z from "zod";
import { desc } from "drizzle-orm";

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

export async function getJobPosts() {
  try {
    const result = await db.query.posts.findMany({
      orderBy: [desc(posts.dateCreated)],
    });
    return result;
  } catch {
    return null;
  }
}

export async function createJobPost(
  values: z.infer<typeof jobPostSchema>,
  session: Session,
) {
  if (!session || !["EMPLOYER", "ADMIN"].includes(session.user.role)) {
    return { error: "Not authorized" };
  }

  try {
    const [result] = await db
      .insert(posts)
      .values({
        ownerId: session.user.id,
        title: values.title,
        company: values.company,
        location: values.location,
        employmentType: values.employmentType,
        workplaceType: values.workplaceType,
        experienceLevel: values.experienceLevel,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        description: values.description,
        requirements: values.requirements ?? null,
        responsibilities: values.responsibilities ?? null,
        benefits: values.benefits ?? null,
      })
      .returning({ postId: posts.postId });

    if (!result) {
      return { error: "Failed to create job post" };
    }

    return { success: true, id: result.postId };
  } catch (error) {
    console.error("Failed to create job post:", error);
    return { error: "Failed to create job post" };
  }
}
