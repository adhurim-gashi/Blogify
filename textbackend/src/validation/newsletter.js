const { z } = require('zod');

const subscribeSchema = z.object({
  email: z.string().email().max(254),
});

module.exports = { subscribeSchema };
