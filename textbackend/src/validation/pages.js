const { z } = require('zod');

const createPageSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

const idParam = z.object({ id: z.string().uuid() });
const slugParam = z.object({ slug: z.string().regex(/^[a-z0-9\-]+$/).min(1) });

module.exports = { createPageSchema, idParam, slugParam };
