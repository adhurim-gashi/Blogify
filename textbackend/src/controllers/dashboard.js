const prisma = require('../utils/prisma');

async function stats(req, res, next) {
  try {
    const users = await prisma.user.count();
    const posts = await prisma.post.count({ where: { deletedAt: null } });
    const categories = await prisma.category.count();
    const comments = await prisma.comment.count();
    const media = await prisma.media.count();
    const tags = await prisma.tag.count();
    res.json({ success: true, data: { users, posts, categories, comments, media, tags } });
  } catch (err) { next(err); }
}

module.exports = { stats };
