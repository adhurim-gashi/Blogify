const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email().max(254),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  password: z.string().min(8).max(128),
  name: z.string().max(128).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const tokenSchema = z.object({ refresh: z.string().min(10) });

const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(8).max(128),
});

const verifyEmailSchema = z.object({
  token: z.string().min(32).max(256),
});

module.exports = { registerSchema, loginSchema, tokenSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema };
