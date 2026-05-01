const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  excerpt: z.string().max(512).optional(),
  status: z.enum(['DRAFT','PUBLISHED','ARCHIVED']).optional(),
  categories: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string().uuid()).optional(),
});

const listPostsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  q: z.string().max(200).optional(),
});

const slugParam = z.object({ slug: z.string().regex(/^[a-z0-9\-]+$/).min(1) });

const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(512).optional(),
  status: z.enum(['DRAFT','PUBLISHED','ARCHIVED']).optional(),
});

module.exports = { createPostSchema, listPostsSchema, slugParam, updatePostSchema };
