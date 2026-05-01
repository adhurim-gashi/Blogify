const express = require('express');

const router = express.Router();
const pagesController = require('../controllers/pages');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createPageSchema, idParam, slugParam } = require('../validation/pages');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', pagesController.list);
router.get('/:slug', validate(slugParam), pagesController.getBySlug);
router.post('/', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(createPageSchema), pagesController.create);
router.put('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(idParam), pagesController.update);
router.delete('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin'), validate(idParam), pagesController.remove);

module.exports = router;
