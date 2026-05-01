const { z } = require('zod');

const tagSchema = z.object({
  name: z.string().min(1).max(128),
});

const idParam = z.object({ id: z.string().uuid() });

const updateTagSchema = idParam.merge(tagSchema);

module.exports = { tagSchema, idParam, updateTagSchema };
