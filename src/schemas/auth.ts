/**
 * Schemas Zod para auth (login, registro).
 * Reutilizados en frontend (React Hook Form) y backend (tRPC).
 */

import { z } from "zod";

const passwordMinLength = 8;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(passwordMinLength, `Mínimo ${passwordMinLength} caracteres`),
  firstName: z.string().min(1, "Nombre requerido"),
  lastName: z.string().min(1, "Apellido requerido"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
