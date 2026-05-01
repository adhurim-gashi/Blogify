const prisma = require('../utils/prisma');

async function create(req, res, next) {
  try {
    const { content, postId, parentId } = req.validated || req.body;
    const sanitizeHtml = require('sanitize-html');
    const clean = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
    const comment = await prisma.comment.create({ data: { content: clean, postId, parentId: parentId || null, authorId: req.user.id } });
    res.json({ success: true, data: { comment } });
  } catch (err) { next(err); }
}

async function listByPost(req, res, next) {
  try {
    const { postId } = req.validated || req.params;
    const comments = await prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' } });
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

module.exports = { create, listByPost, remove };
