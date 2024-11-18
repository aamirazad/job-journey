import { USER_ROLES_WITHOUT_ADMIN } from "@/server/db/schema";
import * as z from "zod";


export const SignUpSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.enum(USER_ROLES_WITHOUT_ADMIN, { 
    message: "Role is required"
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Must be at least 8 characters",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
