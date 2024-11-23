import { USER_ROLES_WITHOUT_ADMIN } from "@/server/db/schema";
import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.enum(USER_ROLES_WITHOUT_ADMIN, {
    message: "Role is required",
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

export const jobPostSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  workplaceType: z.enum(["Remote", "Hybrid", "On-site"]),
  experienceLevel: z.enum(["Entry", "Mid", "Senior"]),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  description: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
});
