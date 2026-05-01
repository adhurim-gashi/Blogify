const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createPostSchema, listPostsSchema, slugParam, updatePostSchema } = require('../validation/posts');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', validate(listPostsSchema), postsController.list);
router.get('/:slug', validate(slugParam), postsController.getBySlug);
router.post('/', requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(createPostSchema), postsController.create);
const { idParam } = require('../validation/common');

router.put('/:id', requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(updatePostSchema), postsController.update);
router.delete('/:id', requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(idParam), postsController.remove);

module.exports = router;
