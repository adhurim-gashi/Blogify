const { z } = require('zod');

const tagSchema = z.object({
  name: z.string().min(1).max(128),
});

const idParam = z.object({ id: z.string().uuid() });

const updateTagSchema = idParam.merge(tagSchema);

// Pagination schema for tags listing to enforce consistent pagination across APIs
const listTagsSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

module.exports = { tagSchema, idParam, updateTagSchema };
