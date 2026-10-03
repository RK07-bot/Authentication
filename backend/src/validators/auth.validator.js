import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().trim().min(3, "Name must be at least 3 characters long"),
    email: z.string().trim().toLowerCase().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be atleast 8 character long"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
