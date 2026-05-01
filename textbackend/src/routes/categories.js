const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { z } = require('zod');
const { validate } = require('../middlewares/validate');

const { categorySchema, updateCategorySchema } = require('../validation/categories');

router.get('/', categoriesController.list);
router.post('/', requireAuth, requireRole('Admin','Author'), validate(categorySchema), categoriesController.create);
router.put('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(updateCategorySchema), categoriesController.update);
router.delete('/:id', requireAuth, requireRole('Admin'), categoriesController.remove);

module.exports = router;
