const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { z } = require('zod');
const { validate } = require('../middlewares/validate');
const perUserRateLimit = require('../middlewares/perUserRateLimit');
const { idParam } = require('../validation/common');
const { listCategoriesSchema, categorySchema, updateCategorySchema } = require('../validation/categories');
// GET list uses pagination validation
router.get('/', validate(listCategoriesSchema), categoriesController.list);
router.post('/', requireAuth, requireRole('Admin','Author'), validate(categorySchema), categoriesController.create);
router.put('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(updateCategorySchema), categoriesController.update);
router.delete('/:id', requireAuth, requireRole('Admin'), validate(idParam), categoriesController.remove);

module.exports = router;
