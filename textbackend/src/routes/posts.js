const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createPostSchema, listPostsSchema, slugParam, updatePostSchema } = require('../validation/posts');
const { idParam } = require('../validation/common');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', validate(listPostsSchema), postsController.list);
router.post('/', requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(createPostSchema), postsController.create);

// UUID routes must be explicit so public slug routes do not steal admin edit URLs.
const uuidPath = '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
router.get(uuidPath, validate(idParam), postsController.getById);
router.put(uuidPath, requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(updatePostSchema), postsController.update);
router.delete(uuidPath, requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(idParam), postsController.remove);

router.get('/:slug', validate(slugParam), postsController.getBySlug);

module.exports = router;
