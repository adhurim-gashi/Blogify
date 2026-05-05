const prisma = require('../utils/prisma');

async function create(req, res, next) {
  try {
    const { content, postId, parentId } = req.validated || req.body;
    const sanitizeHtml = require('sanitize-html');
    // sanitize incoming content to prevent XSS and match spec: Input sanitization on rich fields
    const clean = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
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
    // Admins may need a separate endpoint to list all comments; for now, public listing is filtered
    const where = { postId, deletedAt: null, approved: true };
    const comments = await prisma.comment.findMany({ where, orderBy: { createdAt: 'asc' } });
    res.json({ success: true, data: { comments } });
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
// Protected route should be added in routes: only Admin/Author can call
// Implements spec #8: approve comment
async function approve(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.comment.update({ where: { id }, data: { approved: true } });
    res.json({ success: true, data: { comment: updated } });
  } catch (err) { next(err); }
}

// Reject a comment (soft-delete or mark deletedAt)
// Protected route should be added in routes: only Admin/Author can call
// Implements spec #8: reject comment
async function reject(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: { comment: updated } });
  } catch (err) { next(err); }
}

module.exports = { create, listByPost, remove, approve, reject };
