const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createCommentSchema, postIdParam, idParam } = require('../validation/comments');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

// Admin endpoint to list all comments with post info
router.get('/admin/all', requireAuth, requireRole('Admin', 'Author'), commentsController.listAll);

router.post('/', requireAuth, perUserRateLimit({ max: 60 }), validate(createCommentSchema), commentsController.create);
router.get('/post/:postId', validate(postIdParam), commentsController.listByPost);
router.delete('/:id', requireAuth, perUserRateLimit({ max: 60 }), requireRole('Admin','Author'), validate(idParam), commentsController.remove);

// Approve a comment - only Admins/Authors
router.post('/:id/approve', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(idParam), commentsController.approve);

// Reject a comment (soft-delete) - only Admins/Authors
router.post('/:id/reject', requireAuth, perUserRateLimit({ max: 30 }), requireRole('Admin','Author'), validate(idParam), commentsController.reject);

module.exports = router;
