import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, { message: "Verification code must be of 6 digits only" })
    .regex(/^[0-9]+$/, "Verification code must not contain special characters"),
});
