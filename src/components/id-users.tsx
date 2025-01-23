"use client";
import { usePostHog } from "posthog-js/react";
import { useSearchParams } from "next/navigation";
import { type Session } from "next-auth";

export function PostHogId({ session }: { session: Session }) {
  const posthog = usePostHog();
  const searchParams = useSearchParams();

  const newLoginState = searchParams.get("loginState");
  if (newLoginState) {
    if (newLoginState === "signedIn" && session?.user.email) {
      posthog.identify(session.user.email);
    }
    if (newLoginState === "signedOut") {
      posthog.reset();
    }
  }

  return null;
}
