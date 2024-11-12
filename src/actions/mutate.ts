"use server";

import { users, type UserRole } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

interface changeRoleProps {
  userId: string;
  newRole: UserRole;
}

export async function changeRole({ userId, newRole }: changeRoleProps) {
  try {
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
    console.log("done");
    return { success: "Updated" };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}
