import { auth } from "@/server/auth";
import { verifyFileAccess } from "@/actions/actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const fileId = (await params).id;
    const userId = session.user.id;
    const userRole = session.user.role;

    // Verify access permissions
    const hasAccess = await verifyFileAccess(fileId, userId, userRole);

    if (!hasAccess) {
      return new Response("Unauthorized", { status: 401 });
    }

    const pdfResponse = await fetch(`https://utfs.io/a/i1cb8cwdxj/${fileId}`);

    if (!pdfResponse.ok) {
      return new Response("Failed to fetch PDF", { status: 500 });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error in file download:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
