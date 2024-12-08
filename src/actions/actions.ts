"use server";

import { type SettingsSchema } from "@/components/auth/settings";
import { type jobPostSchema, type ApplicationFormSchema } from "@/schemas";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { applications, posts, users } from "@/server/db/schema";
import { desc, eq, not } from "drizzle-orm";
import { type z } from "zod";
import { sendNewApplicationEmail } from "./resend";

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

export async function getEmployerEmailByPostId(postId: number) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }
  const result = await db
    .select({
      employerEmail: users.email,
      postTitle: posts.title,
    })
    .from(posts)
    .innerJoin(users, eq(posts.ownerId, users.id))
    .where(eq(posts.postId, postId))
    .execute();

  // This will return an array, so we'll get the first result
  return result[0] ?? null;
}

export async function handleSendingNotificationEmail(
  values: z.infer<typeof ApplicationFormSchema>,
  postId: number,
) {
  const info = await getEmployerEmailByPostId(postId);
  if (!info) {
    return { error: "Error sending email (Couldn't get post info)" };
  }
  const result = await sendNewApplicationEmail({
    ...info,
    applicantFirstName: values.firstName,
    applicantLastName: values.lastName,
    applicantEmail: values.email,
  });

  if (result.error) {
    return { error: result.error };
  }
  if (result.success) {
    return { success: true };
  }
  return { error: "Unknown error" };
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

export async function createJobPost(
  values: z.infer<typeof jobPostSchema>,
  replace: number | undefined,
) {
  const session = await auth();

  if (!session || !["EMPLOYER", "ADMIN"].includes(session.user.role)) {
    return { error: "Not authorized" };
  }

  try {
    const [result] = await db
      .insert(posts)
      .values({
        ...values,
        ownerId: session.user.id,
        status: "UNREVIEWED",
        replace: replace,
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

export async function getMyJobPosts(userId: string) {
  const session = await auth();
  if (session?.user.role !== "EMPLOYER") {
    return null;
  }

  try {
    const result = await db.query.posts.findMany({
      orderBy: [desc(posts.dateCreated)],
      where: eq(posts.ownerId, userId),
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function reviewJobPosting(
  id: number,
  status: "UNREVIEWED" | "ACCEPTED" | "DELETED",
) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  try {
    const prev = await db.query.posts.findFirst({
      where: eq(posts.postId, id),
      columns: { replace: true, status: true },
    });
    if (prev?.replace) {
      if (status == "ACCEPTED") {
        await db
          .update(posts)
          .set({ status: "DELETED" })
          .where(eq(posts.postId, prev.replace));
      } else if (status == "UNREVIEWED") {
        await db
          .update(posts)
          .set({ status: prev.status })
          .where(eq(posts.postId, prev.replace));
      }
    }
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

export async function getApplicationsForPost(postId: number) {
  try {
    const postApplications = await db.query.applications.findMany({
      where: eq(applications.postId, postId),
      orderBy: desc(applications.dateApplied),
    });
    return postApplications;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getApplication(id: number | null) {
  if (!id) {
    return null;
  }
  try {
    const application = await db.query.applications.findFirst({
      where: eq(applications.id, id),
    });
    return application;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function reviewApplication(
  id: number,
  status: "APPLIED" | "ACCEPTED" | "REJECTED",
) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }
  try {
    await db
      .update(applications)
      .set({ status: status })
      .where(eq(applications.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to review application" };
  }
}
