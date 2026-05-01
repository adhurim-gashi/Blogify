const { z } = require('zod');

const listMediaSchema = z.object({ page: z.string().optional(), perPage: z.string().optional() });

module.exports = { listMediaSchema };
