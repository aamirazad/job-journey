"use server";

import { type SettingsSchema } from "@/components/auth/settings";
import { type jobPostSchema, type ApplicationFormSchema } from "@/schemas";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { applications, posts, users } from "@/server/db/schema";
import { desc, eq, not, or } from "drizzle-orm";
import { z } from "zod";
import { sendNewApplicationEmail } from "./resend";
// import { createOllama } from "ollama-ai-provider";
// import { env } from "@/env";
import { type JobPost } from "@/server/db/schema";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { truncateWithEllipsis } from "@/lib/utils";

/**
 * Gets a list of users that are not admin
 * Used for the list of users to promote
 */
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

/**
 * Promotes a certain user to admin
 * Only admins can call this function
 * @param userId
 * @returns
 */
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

/**
 * Gets the email of the employer who posted a certain job post
 * For use when sending notification email
 * @param postId
 * @returns
 */
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

  return result[0] ?? null;
}

/**
 * Sends an email notification for a new application posted
 * @param values
 * @param postId
 * @returns
 */
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
  if (session?.user.role == "ADMIN") {
    try {
      const result = await db.query.posts.findMany({
        orderBy: [desc(posts.dateCreated)],
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else if (session?.user.role != "EMPLOYER") {
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

export async function verifyFileAccess(
  fileId: string,
  userId: string,
  userRole: string,
): Promise<boolean> {
  const application = await db.query.applications.findFirst({
    where: or(
      eq(applications.resumeId, fileId),
      eq(applications.coverLetterId, fileId),
    ),
    with: {
      post: {
        with: {
          owner: true,
        },
      },
      owner: true,
    },
  });

  if (!application) {
    return false;
  }

  // Case 1: If the user is a student, they can only access their own files
  if (userRole === "STUDENT") {
    return application.userId === userId;
  }

  // Case 2: If the user is an employer, they can only access files from applications
  // to their own job posts
  if (userRole === "EMPLOYER") {
    return application.post.ownerId === userId;
  }

  // Default: deny access
  return false;
}

export async function getAIRecommendations(
  interests: string,
  jobPosts: JobPost[],
) {
  // const ollama = createOllama({
  //   // optional settings, e.g.
  //   baseURL: env.AI_URL,
  // });
  const session = await auth();

  if (!session) {
    return { error: "You need to be signed in to use AI features" };
  }

  if (session.user.role != "ADMIN") {
    return { error: "Your account does not have AI capabilities yet" };
  }

  const system = `Your job is to choose three job posts that would fit the interests of a user. You will be given the user's input on what they are interested in and are looking for in a future job.
        You must choose from the available job posts listed below:
        ${jobPosts
          ?.map(
            (job) => `
          ID: ${job.postId}
          Title: ${job.title}
          Company: ${job.company}
          Location: ${job.location}
          Employment type: ${job.employmentType}
          Workplace type: ${job.workplaceType}
          Experience level: ${job.experienceLevel}
          Pay: ${job.pay}
          Description: ${truncateWithEllipsis(job.description, 200)}
          Requirements: ${job.requirements}
          `,
          )
          .join("\n")}

        To recap, based on the user's intersts, return a list of 3 recommended posts. You must respond following this schema:
        z.object({
          recommendations: z.array(z.object({
            id: z.number(),
            reasoning: z.string(),
          }))
        })
        You must match this schema exactly and do not respond with any text outside of this schema. For the id, just give the number and nothing else, do not include the "ID: " part of the prompt
        For each recommendation, use second-person language like "Your interest in...
        Do not make up facts about the user and do not hallucinate anything. If the user does not give enough infromation, choose jobs posts which seem interesting and give the reasoning as such".
      `;

  try {
    const { object } = await generateObject({
      model: groq("gemma2-9b-it"),
      schema: z.object({
        recommendations: z.array(
          z.object({
            id: z.number(),
            reasoning: z.string(),
          }),
        ),
      }),
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: interests,
        },
      ],
    });
    return object.recommendations;
  } catch {
    return { error: "Failed to get recommendations" };
  }
}

interface GeocodingResponse {
  features: Array<{
    center: [number, number];
    place_name: string;
  }>;
}

export async function geocodeLocation(
  location: string,
): Promise<[number, number] | { error: string }> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = (await response.json()) as GeocodingResponse;

    if (data.features[0] && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;

      return [longitude, latitude];
    }
  } catch {
    return { error: "Failed to find job location" };
  }
  return { error: "Failed to find job location" };
}
