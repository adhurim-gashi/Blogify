const prisma = require('../utils/prisma');
const config = require('../config/env');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function sitemap(req, res, next) {
  try {
    const now = new Date();
    const [posts, pages] = await prisma.$transaction([
      prisma.post.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          OR: [
            { isScheduled: false },
            { isScheduled: true, scheduledAt: { lte: now } },
            { scheduledAt: null }
          ]
        },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 1000,
      }),
      prisma.page.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 200,
      }),
    ]);

    const urls = [
      { loc: `${config.siteUrl}/home`, lastmod: new Date() },
      { loc: `${config.siteUrl}/blog`, lastmod: new Date() },
      ...posts.map(post => ({ loc: `${config.siteUrl}/blog/${post.slug}`, lastmod: post.updatedAt })),
      ...pages.map(page => ({ loc: `${config.siteUrl}/${page.slug}`, lastmod: page.updatedAt })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(url => `  <url><loc>${escapeXml(url.loc)}</loc><lastmod>${url.lastmod.toISOString()}</lastmod></url>`)
      .join('\n')}\n</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    next(err);
  }
}

module.exports = { sitemap };
