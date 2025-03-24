import * as z from "zod";

export const USER_ROLES = ["ADMIN", "STUDENT", "EMPLOYER"] as const;
export const USER_ROLES_WITHOUT_ADMIN = ["STUDENT", "EMPLOYER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SignUpSchema = z
  .object({
    name: z.string({ message: "Input a string" }).min(1, {
      message: "Name is required",
    }),
    role: z.enum(USER_ROLES_WITHOUT_ADMIN, {
      message: "Role is required",
    }),
    email: z.string({ message: "Input a string" }).email({
      message: "Email is required",
    }),
    password: z.string({ message: "Input a string" }).min(8, {
      message: "Must be at least 8 characters",
    }),
    confirm: z
      .string({ message: "Input a string" })
      .min(1, { message: "Please retype your password to confirm" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const LoginSchema = z.object({
  email: z.string({ message: "Input a string" }).email({
    message: "Email is required",
  }),
  password: z.string({ message: "Input a string" }).min(1, {
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
    .string({ message: "Input a string" })
    .min(2, { message: "Text must be at least 2 characters." })
    .max(50, { message: "Text must be less than 50 characters" }),

  company: z
    .string({ message: "Input a string" })
    .min(2, { message: "Text must be at least 2 characters." })
    .max(50, { message: "Text must be less than 50 characters" }),

  location: z
    .string({ message: "Input a string" })
    .min(2, { message: "Text must be at least 2 characters." })
    .max(50, { message: "Text must be less than 50 characters" }),

  employmentType: z
    .string({ message: "Input a string" })
    .min(1, { message: "Select one" }),
  workplaceType: z
    .string({ message: "Input a string" })
    .min(1, { message: "Select one" }),
  experienceLevel: z
    .string({ message: "Input a string" })
    .min(1, { message: "Select one" }),

  pay: z
    .string({ message: "Input a string" })
    .min(2, { message: "Text must be at least 2 characters." })
    .max(50, { message: "Text must be less than 50 characters" }),

  description: z
    .string({ message: "Input a string" })
    .min(10, { message: "Job description must be at least 10 characters." })
    .max(2000, { message: "Text must be less than 2,000 characters" }),

  requirements: z
    .string({ message: "Input a string" })
    .max(2000, { message: "Text must be less than 2,000 characters" })
    .optional(),
  responsibilities: z
    .string({ message: "Input a string" })
    .max(2000, { message: "Text must be less than 2,000 characters" })
    .optional(),
  benefits: z
    .string({ message: "Input a string" })
    .max(2000, { message: "Text must be less than 2,000 characters" })
    .optional(),
});

export type EmploymentType = (typeof employmentTypeValues)[number];
export type WorkplaceType = (typeof workplaceTypeValues)[number];
export type ExperienceLevel = (typeof experienceLevelValues)[number];

export const ApplicationFormSchema = z.object({
  resumeId: z.string().min(1, { message: "Be sure to click upload" }),
  coverLetterId: z.string().min(1, { message: "Be sure to click upload" }),
  firstName: z
    .string({ message: "Input a string" })
    .min(1, { message: "First name is required" })
    .max(255, { message: "First name must be less than 255 characters" }),
  lastName: z
    .string({ message: "Input a string" })
    .min(1, { message: "Last name is required" })
    .max(255, { message: "Last name must be less than 255 characters" }),
  phoneNumber: z
    .string({ message: "Incorect type" })
    .min(1, { message: "Phone Number is required" })
    .max(255, { message: "Phone number must be less than 255 characters" }),
  email: z.string({ message: "Input a string" }).email({
    message: "Email is required",
  }),
});

export interface SearchFilters {
  search: string;
  employmentTypes: string[];
  // Add more filter types as needed
}

export const initialSearchFilters: SearchFilters = {
  search: "",
  employmentTypes: [],
};
