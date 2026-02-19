import { z } from "zod"

import { AUTH_ERRORS, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "constants/auth"

export const emailSchema = z.string().email(AUTH_ERRORS.INVALID_EMAIL)

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, AUTH_ERRORS.PASSWORD_TOO_SHORT)
  .max(PASSWORD_MAX_LENGTH, AUTH_ERRORS.PASSWORD_TOO_LONG)

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const signupFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  })

export const setPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  })

export const resetPasswordFormSchema = z.object({
  email: emailSchema,
})
