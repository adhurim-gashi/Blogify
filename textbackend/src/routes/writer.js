const express = require('express');
const router = express.Router();
const writerController = require('../controllers/writer');
const { requireAuth, requireRole, requireVerifiedEmail } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const perUserRateLimit = require('../middlewares/perUserRateLimit');
const { applySchema, applicationIdParam, rejectSchema } = require('../validation/writer');

router.post('/apply', requireAuth, requireVerifiedEmail, perUserRateLimit({ max: 5 }), validate(applySchema), writerController.apply);
router.get('/applications', requireAuth, requireRole('Admin'), writerController.listPending);
router.patch('/applications/:id/approve', requireAuth, requireRole('Admin'), validate(applicationIdParam), writerController.approve);
router.patch('/applications/:id/reject', requireAuth, requireRole('Admin'), validate(rejectSchema), writerController.reject);

module.exports = router;
