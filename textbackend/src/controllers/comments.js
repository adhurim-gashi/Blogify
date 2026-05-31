const prisma = require('../utils/prisma');
const { recordAuditLog } = require('../utils/auditLog');

const publicAuthorSelect = { id: true, email: true, username: true, name: true };

function publicPostWhere(id) {
  const now = new Date();
  return {
    id,
    deletedAt: null,
    status: 'PUBLISHED',
    OR: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { lte: now } },
      { scheduledAt: null }
    ],
  };
}

async function create(req, res, next) {
  try {
    const { content, postId, parentId } = req.validated || req.body;
    const sanitizeHtml = require('sanitize-html');
    // sanitize incoming content to prevent XSS and match spec: Input sanitization on rich fields
    const clean = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
    const post = await prisma.post.findFirst({ where: publicPostWhere(postId) });
    if (!post) return res.status(404).json({ success: false, data: null, message: 'Post is not available for comments.' });

    if (parentId) {
      const parent = await prisma.comment.findFirst({ where: { id: parentId, postId, deletedAt: null, approved: true } });
      if (!parent) return res.status(400).json({ success: false, data: null, message: 'Parent comment does not belong to this post.' });
    }

    // Create comment with `approved: false` by default to require moderation
    // This satisfies spec #8: Comments linked to user + post and moderation (approve/reject)
    const comment = await prisma.comment.create({ data: { content: clean, postId, parentId: parentId || null, authorId: req.user.id, approved: false } });
    res.json({ success: true, data: { comment } });
  } catch (err) { next(err); }
}

async function listByPost(req, res, next) {
  try {
    const { postId } = req.validated || req.params;
    // Only return approved comments for public listing to enforce moderation workflow
    // Admin moderation uses a separate endpoint; public listing is filtered.
    const where = { postId, deletedAt: null, approved: true };
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, name: true, username: true } },
        _count: { select: { reactions: true } }
      }
    });
    res.json({
      success: true,
      data: {
        comments: comments.map(comment => ({
          ...comment,
          reactionCount: comment._count.reactions,
          _count: undefined
        }))
      }
    });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;

    // Fetch all comments with related post and author info in one query
    const [comments, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { deletedAt: null },
        include: { post: true, author: { select: publicAuthorSelect } },
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.comment.count({ where: { deletedAt: null } })
    ]);

    res.json({ success: true, data: { comments, meta: { total } } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const deleted = await prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: { comment: deleted } });
  } catch (err) { next(err); }
}

// Approve a comment (set approved = true)
// Protected route is Admin-only in routes.
// Implements spec #8: approve comment
async function approve(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.comment.update({ where: { id }, data: { approved: true } });
    await recordAuditLog({ action: 'comment_approve', performedById: req.user.id, targetType: 'Comment', targetId: id });
    res.json({ success: true, data: { comment: updated } });
  } catch (err) { next(err); }
}

// Reject a comment (soft-delete or mark deletedAt)
// Protected route is Admin-only in routes.
// Implements spec #8: reject comment
async function reject(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    await recordAuditLog({ action: 'comment_reject', performedById: req.user.id, targetType: 'Comment', targetId: id });
    res.json({ success: true, data: { comment: updated } });
  } catch (err) { next(err); }
}

async function toggleReaction(req, res, next) {
  try {
    const { id, type = 'LIKE' } = req.validated || req.params;
    const comment = await prisma.comment.findFirst({ where: { id, deletedAt: null, approved: true } });
    if (!comment) return res.status(404).json({ success: false, data: null, message: 'Comment not found.' });

    const removed = await prisma.commentReaction.deleteMany({ where: { commentId: id, userId: req.user.id, type } });
    if (removed.count === 0) {
      await prisma.commentReaction.upsert({
        where: { commentId_userId_type: { commentId: id, userId: req.user.id, type } },
        update: {},
        create: { commentId: id, userId: req.user.id, type },
      });
    }

    const reactionCount = await prisma.commentReaction.count({ where: { commentId: id, type } });
    res.json({
      success: true,
      data: { liked: removed.count === 0, reactionCount },
      message: removed.count > 0 ? 'Reaction removed.' : 'Reaction saved.',
    });
  } catch (err) { next(err); }
}

module.exports = { create, listByPost, listAll, remove, approve, reject, toggleReaction };
