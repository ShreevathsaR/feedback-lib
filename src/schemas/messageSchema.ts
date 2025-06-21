import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, {message: "Content must be of atleast 10 characters"})
        .max(10, {message: "Content cannot exceed 300 characters"})
})