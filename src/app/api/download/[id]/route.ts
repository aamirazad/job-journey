import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { applications, posts } from "@/server/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!(await params)) {
    return new Response("Not found", { status: 404 });
  }

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const slug = (await params).id;

  if (session.user.role == "STUDENT") {
    const hasAccess = await db
      .select({ exists: sql<boolean>`COUNT(*) > 0` })
      .from(applications)
      .where(
        and(
          eq(applications.userId, session.user.id),
          or(
            eq(applications.resumeId, slug),
            eq(applications.coverLetterId, slug),
          ),
        ),
      );
    if (!hasAccess) {
      return new Response("Unauthorized", { status: 401 });
    }
  } else if (session.user.role == "EMPLOYER") {
    const hasAccess = await db
      .select({ exists: sql<boolean>`COUNT(*) > 0` })
      .from(applications)
      .innerJoin(posts, eq(applications.postId, posts.postId))
      .where(
        and(
          eq(posts.ownerId, session.user.id),
          or(
            eq(applications.resumeId, slug),
            eq(applications.coverLetterId, slug),
          ),
        ),
      );
    if (!hasAccess) {
      return new Response("Unauthorized", { status: 401 });
    }
  } else {
    return new Response("Unauthorized", { status: 401 });
  }

  const pdfResponse = await fetch(`https://utfs.io/a/i1cb8cwdxj/${slug}`);

  if (!pdfResponse.ok) {
    return new Response("Failed to fetch PDF", { status: 500 });
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();
  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
    },
  });
}
