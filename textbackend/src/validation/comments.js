const { z } = require('zod');

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

const postIdParam = z.object({ postId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

module.exports = { createCommentSchema, postIdParam, idParam };
