import { auth } from "@/server/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!(await params)) {
    return new Response("Not found", { status: 404 });
  }

  if (
    !session ||
    !(
      session.user.role.includes("ADMIN") ||
      session.user.role.includes("EMPLOYER")
    )
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const slug = (await params).id;

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
