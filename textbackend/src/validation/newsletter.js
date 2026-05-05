const { z } = require('zod');

const subscribeSchema = z.object({
  email: z.string().email().max(254),
});

module.exports = { subscribeSchema };

// Pagination for subscribers listing (admin)
const listSubscribersSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

module.exports = { subscribeSchema, listSubscribersSchema };
