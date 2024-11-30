"use server";

import type { ApplicationFormSchema, jobPostSchema } from "@/schemas";
import { db } from "@/server/db";
import { applications, posts, users } from "@/server/db/schema";
import type { Session } from "next-auth";
import type * as z from "zod";
import { eq, desc } from "drizzle-orm";
import type { SettingsSchema } from "@/components/auth/settings";

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

export async function setUserSettings(
  values: z.infer<typeof SettingsSchema>,
  session: Session,
) {
  if (!session) {
    return { error: "Not authorized" };
  }

  try {
    await db
      .update(users)
      .set({
        ...values,
      })
      .where(eq(users.id, session.user.id))
      .returning({ updatedId: users.id });

    return { success: true };
  } catch {
    return { error: "Failed to update user settings" };
  }
}

export async function handleJobApplication(
  values: z.infer<typeof ApplicationFormSchema>,
  session: Session,
  postId: number,
) {
  if (!session.user) {
    return { error: "Unauthorized" };
  }
  await db.insert(applications).values({
    ...values,
    userId: String(session.user.id),
    postId: postId,
  });
  return { success: true };

  return { error: "Failed to post application" };
}

export async function getPostNameFromId(id: number) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.postId, id),
    });
    return post;
  } catch {
    return null;
  }
}
