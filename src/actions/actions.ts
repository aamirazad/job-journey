"use server";

import { type SettingsSchema } from "@/components/auth/settings";
import { type jobPostSchema, type ApplicationFormSchema } from "@/schemas";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { applications, posts, users } from "@/server/db/schema";
import { desc, eq, not } from "drizzle-orm";
import { type z } from "zod";

export async function getNonAdminUsers() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const usersWithoutAdmin = await db
      .select()
      .from(users)
      .where(not(eq(users.role, "ADMIN")));
    return usersWithoutAdmin;
  } catch {
    throw new Error("Failed to get users");
  }
}

export async function promoteUser(userId: string) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  try {
    await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, userId));
    return { success: true };
  } catch {
    return { error: "Failed to promote" };
  }
}

export async function handleJobApplication(
  values: z.infer<typeof ApplicationFormSchema>,
  postId: number,
) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  await db.insert(applications).values({
    ...values,
    userId: String(session.user.id),
    postId: postId,
  });
  return { success: true };
}

export async function createJobPost(values: z.infer<typeof jobPostSchema>) {
  const session = await auth();

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

export async function setUserSettings(values: z.infer<typeof SettingsSchema>) {
  const session = await auth();
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
  } catch (error) {
    console.error(error);
    return { error: "Failed to update user settings" };
  }
}

export async function getPostNameFromId(id: number) {
  const session = await auth();
  if (!session) {
    return null;
  }
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.postId, id),
    });
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getJobPosts() {
  const session = await auth();
  if (!session) {
    return null;
  }
  try {
    const result = await db.query.posts.findMany({
      orderBy: [desc(posts.dateCreated)],
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getReviewedJobPosts() {
  try {
    const result = await db.query.posts.findMany({
      where: eq(posts.status, "ACCEPTED"),
      orderBy: [desc(posts.dateCreated)],
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Failed to get reviewed job postings");
  }
}

export async function getUnreviewedJobPosts() {
  const session = await auth();
  if (!session) {
    return new Error("Unauthorized");
  }
  try {
    const result = await db.query.posts.findMany({
      where: eq(posts.status, "UNREVIEWED"),
      orderBy: [desc(posts.dateCreated)],
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Failed to get unreviewed job postings");
  }
  return new Error("Failed to get unreviewed job postings");
}

export async function reviewJobPosting(
  id: number,
  status: "UNREVIEWED" | "ACCEPTED" | "DELETED",
) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }
  try {
    await db.update(posts).set({ status: status }).where(eq(posts.postId, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to review job posting" };
  }
}

export async function getJobPost(id: number) {
  const session = await auth();
  if (!session) {
    return null;
  }
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.postId, id),
    });
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
}
