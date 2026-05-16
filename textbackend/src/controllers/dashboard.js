const prisma = require('../utils/prisma');

async function stats(req, res, next) {
  try {
    const [totalUsers, totalPosts, totalCategories, totalComments, totalMedia, totalTags, totalSubscribers] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.category.count(),
      prisma.comment.count({ where: { deletedAt: null } }),
      prisma.media.count(),
      prisma.tag.count(),
      prisma.newsletterSubscriber.count()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalCategories,
        totalComments,
        totalMedia,
        totalTags,
        totalSubscribers
      }
    });
  } catch (err) { next(err); }
}

module.exports = { stats };
