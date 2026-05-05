const { z } = require('zod');

const createPageSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

const idParam = z.object({ id: z.string().uuid() });
const slugParam = z.object({ slug: z.string().regex(/^[a-z0-9\-]+$/).min(1) });

// Pagination for pages listing
const listPagesSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

// Update page (id + optional fields)
const updatePageSchema = idParam.merge(z.object({ title: z.string().min(1).max(200).optional(), content: z.string().min(1).optional() }));

module.exports = { createPageSchema, idParam, slugParam };
