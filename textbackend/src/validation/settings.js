const { z } = require('zod');

const settingSchema = z.object({
  key: z.string().min(1).max(128),
  value: z.string().min(0).max(5000),
});

const idParam = z.object({ id: z.string().uuid() });

const updateSettingSchema = idParam.merge(settingSchema);

module.exports = { settingSchema, idParam, updateSettingSchema };
