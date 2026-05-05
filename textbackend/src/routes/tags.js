const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { tagSchema, idParam, updateTagSchema } = require('../validation/tags');
const perUserRateLimit = require('../middlewares/perUserRateLimit');
const { listTagsSchema } = require('../validation/tags');

router.get('/', validate(listTagsSchema), tagsController.list);
router.post('/', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(tagSchema), tagsController.create);
router.put('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(updateTagSchema), tagsController.update);
router.delete('/:id', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin'), validate(idParam), tagsController.remove);

module.exports = router;
