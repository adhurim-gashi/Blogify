const prisma = require('../utils/prisma');

function visiblePublishedPostWhere(extra = {}) {
  const now = new Date();
  return {
    deletedAt: null,
    status: 'PUBLISHED',
    OR: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { lte: now } },
      { scheduledAt: null }
    ],
    ...extra
  };
}

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  createdAt: true,
  author: {
    select: {
      name: true,
      username: true
    }
  },
  categories: {
    select: {
      name: true
    },
    take: 1
  },
  media: {
    select: {
      filepath: true
    }
  }
};

function toHomePost(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.media?.filepath || null,
    // The current schema has no dedicated publishedAt field; createdAt is the publish timestamp for public feeds.
    publishedAt: post.createdAt,
    author: {
      name: post.author?.name || post.author?.username || 'Blogify'
    },
    category: {
      name: post.categories?.[0]?.name || 'Uncategorized'
    }
  };
}

// Public feed for posts explicitly marked as featured and published.
async function featuredPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      where: visiblePublishedPostWhere({ isFeatured: true }),
      select: postSelect,
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    res.json({ success: true, data: { posts: posts.map(toHomePost) } });
  } catch (err) {
    next(err);
  }
}

// Public homepage counters kept intentionally small and count-only for fast rendering.
async function stats(req, res, next) {
  try {
    const [totalPosts, totalCategories, totalTags, totalSubscribers] = await prisma.$transaction([
      prisma.post.count({ where: visiblePublishedPostWhere() }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.newsletterSubscriber.count()
    ]);

    res.json({
      success: true,
      data: { stats: { totalPosts, totalCategories, totalTags, totalSubscribers } }
    });
  } catch (err) {
    next(err);
  }
}

// Public latest-post feed ordered by the publish timestamp used by the current schema.
async function recentPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      where: visiblePublishedPostWhere(),
      select: postSelect,
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    res.json({ success: true, data: { posts: posts.map(toHomePost) } });
  } catch (err) {
    next(err);
  }
}

// Public newsletter signup with explicit duplicate handling instead of silent upsert.
async function subscribe(req, res, next) {
  try {
    const email = String(req.validated.email).trim().toLowerCase();
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        error: 'This email is already subscribed.',
        message: 'This email is already subscribed.'
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({ data: { email } });
    res.status(201).json({
      success: true,
      data: { subscriber },
      message: 'Subscription saved successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { featuredPosts, stats, recentPosts, subscribe };
