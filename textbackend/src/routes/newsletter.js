const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter');
const { validate } = require('../middlewares/validate');
const { subscribeSchema, listSubscribersSchema } = require('../validation/newsletter');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { idParam } = require('../validation/common');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.post('/subscribe', validate(subscribeSchema), newsletterController.subscribe);
router.get('/subscribers', requireAuth, requireRole('Admin'), validate(listSubscribersSchema), newsletterController.list);

// Remove subscriber (Admin only)
router.delete('/subscribers/:id', requireAuth, requireRole('Admin'), perUserRateLimit({ max: 10 }), validate(idParam), newsletterController.remove);

module.exports = router;
