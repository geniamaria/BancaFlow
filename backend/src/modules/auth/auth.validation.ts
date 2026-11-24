import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    phone: z.string().trim().regex(/^\+?[0-9\s()-]{8,20}$/),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/[A-Za-z]/, "A palavra-passe deve conter letras.")
      .regex(/[0-9]/, "A palavra-passe deve conter números."),
  })
  // Campo extra "role" é recusado: ninguém pode escolher um papel no registo público.
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(72),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
