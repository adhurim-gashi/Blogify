const { z } = require('zod');

const updateUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(254).optional(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  name: z.string().max(128).optional(),
  bio: z.string().max(1000).optional(),
});

const listUsersSchema = z.object({ page: z.string().optional(), perPage: z.string().optional() });

module.exports = { updateUserSchema, listUsersSchema };
