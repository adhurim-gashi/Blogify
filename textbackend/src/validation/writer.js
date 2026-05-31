const { z } = require('zod');

const applySchema = z.object({
  message: z.string().max(2000).optional(),
});

const applicationIdParam = z.object({
  id: z.string().uuid(),
});

const rejectSchema = applicationIdParam.extend({
  reason: z.string().max(1000).optional(),
});

module.exports = { applySchema, applicationIdParam, rejectSchema };
