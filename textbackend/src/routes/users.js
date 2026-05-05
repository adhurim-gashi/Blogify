const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { updateUserSchema, listUsersSchema } = require('../validation/users');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', requireAuth, requireRole('Admin'), validate(listUsersSchema), usersController.list);
router.get('/me', requireAuth, usersController.me);
const { idParam } = require('../validation/common');

router.get('/:id', requireAuth, validate(idParam), usersController.get);
router.put('/:id', requireAuth, perUserRateLimit({ max: 30 }), validate(updateUserSchema), usersController.update);
router.delete('/:id', requireAuth, requireRole('Admin'), validate(idParam), usersController.remove);
// Disable user (Admin only)
router.post('/:id/disable', requireAuth, requireRole('Admin'), validate(idParam), usersController.disable);
// Activate user (Admin only)
router.post('/:id/activate', requireAuth, requireRole('Admin'), validate(idParam), usersController.activate);

module.exports = router;
