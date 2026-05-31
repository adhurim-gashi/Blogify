const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { settingSchema, idParam, updateSettingSchema, listSettingsSchema } = require('../validation/settings');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', validate(listSettingsSchema), settingsController.list);
router.post('/', requireAuth, perUserRateLimit({ max: 10 }), requireRole('Admin'), validate(settingSchema), settingsController.create);
router.put('/:id', requireAuth, perUserRateLimit({ max: 10 }), requireRole('Admin'), validate(updateSettingSchema), settingsController.update);
router.delete('/:id', requireAuth, perUserRateLimit({ max: 10 }), requireRole('Admin'), validate(idParam), settingsController.remove);

module.exports = router;
