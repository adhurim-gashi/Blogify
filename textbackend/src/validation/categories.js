const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(1).max(128),
});

const idParam = z.object({ id: z.string().uuid() });

const updateCategorySchema = idParam.merge(categorySchema);

// Pagination and list query schema to enforce consistent pagination on list endpoints
// Implements Additional Requirements: Every list endpoint must support pagination
const listCategoriesSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

module.exports = { categorySchema, idParam, updateCategorySchema };
