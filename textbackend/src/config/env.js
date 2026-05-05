// Environment validation and configuration
// Implements Additional Mandatory Requirement: environment variable validation on startup
// This module validates required env vars using Zod and exports the normalized config
const { z } = require('zod');

const envSchema = z.object({
  DATABASE_URL: z.string().min(10),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXP: z.string().optional(),
  JWT_REFRESH_EXP: z.string().optional(),
  JWT_REFRESH_TTL_MS: z.string().optional(),
  PORT: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),
  MAX_UPLOAD_SIZE: z.string().optional(),
});

// Parse and validate process.env
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation error:', parsed.error.format());
  // Fail fast to prevent running in a misconfigured state
  process.exit(1);
}

// Export a normalized config object for use by the server
const raw = parsed.data;
const config = {
  databaseUrl: raw.DATABASE_URL,
  jwt: {
    accessSecret: raw.JWT_ACCESS_SECRET,
    refreshSecret: raw.JWT_REFRESH_SECRET,
    accessExp: raw.JWT_ACCESS_EXP || '15m',
    refreshExp: raw.JWT_REFRESH_EXP || '7d',
    refreshTtlMs: parseInt(raw.JWT_REFRESH_TTL_MS || String(7 * 24 * 3600 * 1000)),
  },
  port: parseInt(raw.PORT || '4000'),
  corsOrigins: raw.CORS_ORIGINS ? raw.CORS_ORIGINS.split(',') : ['http://localhost:5173'],
  maxUploadSize: parseInt(raw.MAX_UPLOAD_SIZE || '5242880'),
};

module.exports = config;
