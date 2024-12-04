"use server";

import { auth } from "@/server/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewApplicationEmail({
  employerEmail,
  postTitle,
  applicantFirstName,
  applicantLastName,
  applicantEmail,
}: {
  employerEmail: string;
  postTitle: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  try {
    const { error } = await resend.emails.send({
      from: "Job Application Notifications <notifications@mail.aamira.me>",
      to: [employerEmail],
      subject: `New Application Received: ${postTitle}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>New Job Application Received</h1>
        <p>A new application has been submitted for your job posting:</p>
        <h2>${postTitle}</h2>

        <h3>Applicant Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${applicantFirstName} ${applicantLastName}</li>
          <li><strong>Email:</strong> ${applicantEmail}</li>
        </ul>

        <p>Log in to your dashboard to review the full application.</p>

        <p style="color: #666; font-size: 0.8em;">
          This is an automated notification.
        </p>
      </div>
      `,
    });

    if (error) {
      console.error(error);
      return { error: "Error sending email" };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : "Error sending email",
    };
  }
}
