const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { requireAuth, optionalAuth, requireRole, requireVerifiedEmail } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createPostSchema, listPostsSchema, slugParam, updatePostSchema, postReactionSchema } = require('../validation/posts');
const { idParam } = require('../validation/common');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.get('/', optionalAuth, validate(listPostsSchema), postsController.list);
router.post('/', requireAuth, requireVerifiedEmail, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(createPostSchema), postsController.create);

// UUID routes must be explicit so public slug routes do not steal admin edit URLs.
const uuidPath = '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
router.get(uuidPath, requireAuth, requireRole('Author','Admin'), validate(idParam), postsController.getById);
router.put(uuidPath, requireAuth, requireVerifiedEmail, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(updatePostSchema), postsController.update);
router.delete(uuidPath, requireAuth, perUserRateLimit({ max: 60 }), requireRole('Author','Admin'), validate(idParam), postsController.remove);
router.post(`${uuidPath}/react`, requireAuth, perUserRateLimit({ max: 60 }), validate(postReactionSchema), postsController.toggleReaction);

router.get('/:slug', optionalAuth, validate(slugParam), postsController.getBySlug);

module.exports = router;
