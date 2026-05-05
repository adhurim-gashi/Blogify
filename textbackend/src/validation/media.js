const { z } = require('zod');

const listMediaSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

module.exports = { listMediaSchema };
