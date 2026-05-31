const { z } = require('zod');

const listAuditLogsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  action: z.string().max(100).optional(),
  targetType: z.string().max(100).optional(),
  performedById: z.string().uuid().optional(),
});

module.exports = { listAuditLogsSchema };
