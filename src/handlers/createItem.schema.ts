import { z } from "zod";

export const createItemSchema = z.object({
  subject: z.string(),
  itemType: z.enum(["multiple-choice", "free-response", "essay"]),
  difficulty: z.number().positive().min(1).max(5),
  content: z.object({
    question: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    explanation: z.string(),
  }),
  metadata: z.object({
    author: z.string(),
    status: z.enum(["draft", "review", "approved", "archived"]),
    tags: z.array(z.string()),
  }),
  securityLevel: z.enum(["standard", "secure", "highly-secure"]),
});
