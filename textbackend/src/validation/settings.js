const { z } = require('zod');

const settingSchema = z.object({
  key: z.string().min(1).max(128),
  value: z.string().min(0).max(5000),
});

const idParam = z.object({ id: z.string().uuid() });

const updateSettingSchema = idParam.merge(settingSchema);

// Pagination schema for settings list endpoint
const listSettingsSchema = z.object({ page: z.string().optional(), perPage: z.string().optional(), q: z.string().max(200).optional() });

module.exports = { settingSchema, idParam, updateSettingSchema, listSettingsSchema };

module.exports = { settingSchema, idParam, updateSettingSchema };
