"use server";

import type { EmploymentType, jobPostSchema } from "@/schemas";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import type { Session } from "next-auth";
import type * as z from "zod";
import { and, desc, ilike, inArray } from "drizzle-orm";

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

interface JobPostsProps {
  search?: string;
  employmentTypes?: EmploymentType[];
}

export async function getJobPosts({ search, employmentTypes }: JobPostsProps) {
  try {
    // Construct a query dynamically using Drizzle's utilities
    const conditions = [];

    // Add search condition if provided
    if (search) {
      conditions.push(ilike(posts.title, `%${search}%`)); // Case-insensitive match
    }

    // Add employmentTypes condition if provided
    if (employmentTypes && employmentTypes.length > 0) {
      conditions.push(inArray(posts.employmentType, employmentTypes));
    }

    // Combine all conditions using `and` (if any)
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute the query
    const result = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.dateCreated));

    return result;
  } catch (error) {
    console.error("Error fetching job posts:", error);
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
