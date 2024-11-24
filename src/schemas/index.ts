import * as z from "zod";

export const USER_ROLES = ["ADMIN", "STUDENT", "EMPLOYER"] as const;
export const USER_ROLES_WITHOUT_ADMIN = ["STUDENT", "EMPLOYER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

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


export const employmentTypeValues = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;
export const workplaceTypeValues = ["Remote", "Hybrid", "On-site"] as const;
export const experienceLevelValues = ["Entry", "Mid", "Senior"] as const;

// Job post schema
export const jobPostSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters." })
    .max(255, { message: "Job title must be less than 255 characters" }),

  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters." })
    .max(255, { message: "Company name must be less than 255 characters" }),

  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." })
    .max(255, { message: "Location must be less than 255 characters" }),

  employmentType: z.enum(employmentTypeValues),
  workplaceType: z.enum(workplaceTypeValues),
  experienceLevel: z.enum(experienceLevelValues),

  salaryMin: z
    .number()
    .min(0)
    .max(2147483647, { message: "Minimum salary must be below 2,000,000,000" }),

  salaryMax: z
    .number()
    .min(0)
    .max(2147483647, { message: "Maximum salary must be below 2,000,000,000" }),

  description: z
    .string()
    .min(10, { message: "Job description must be at least 10 characters." }),

  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
});

export type EmploymentType = typeof employmentTypeValues[number];
export type WorkplaceType = typeof workplaceTypeValues[number];
export type ExperienceLevel = typeof experienceLevelValues[number];