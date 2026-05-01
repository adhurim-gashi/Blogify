const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(1).max(128),
});

const idParam = z.object({ id: z.string().uuid() });

const updateCategorySchema = idParam.merge(categorySchema);

module.exports = { categorySchema, idParam, updateCategorySchema };
