const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');
const sanitizeHtml = require('sanitize-html');

async function makeUniquePostSlug(value, currentId) {
  const base = makeSlug(value) || 'post';
  let slug = base;
  let index = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${index++}`;
  }
}

async function list(req, res, next) {
  try {
    const { page = 1, perPage = 10, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = { deletedAt: null, AND: [] };
    if (q) where.AND.push({ OR: [{ title: { contains: q } }, { content: { contains: q } }] });
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { author: true, categories: true, tags: true } }),
      prisma.post.count({ where })
    ]);
    res.json({ success: true, data: { posts, meta: { total } } });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const post = await prisma.post.findUnique({ where: { id }, include: { author: true, categories: true, tags: true, media: true, comments: true } });
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { post } });
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const { slug } = req.validated || req.params;
    const post = await prisma.post.findUnique({ where: { slug }, include: { author: true, categories: true, tags: true, media: true, comments: true } });
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });
    // increment views
    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
    res.json({ success: true, data: { post } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, content, excerpt, status, categories = [], tags = [] } = req.validated;
    const cleanContent = sanitizeHtml(content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });
    const slug = await makeUniquePostSlug(title);
    const data = { title, content: cleanContent, excerpt, slug, status: status || 'DRAFT', authorId: req.user.id };
    const post = await prisma.post.create({ data });
    // connect categories and tags
    if (categories.length) {
      const cats = await prisma.category.findMany({ where: { id: { in: categories } } });
      await prisma.post.update({ where: { id: post.id }, data: { categories: { connect: cats.map(c=>({ id: c.id })) } } });
    }
    if (tags.length) {
      const tgs = await prisma.tag.findMany({ where: { id: { in: tags } } });
      await prisma.post.update({ where: { id: post.id }, data: { tags: { connect: tgs.map(t=>({ id: t.id })) } } });
    }
    res.json({ success: true, data: { post } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const raw = { ...(req.validated || req.body) };
    delete raw.id;
    if (raw.content) raw.content = sanitizeHtml(raw.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });

    // Handle category and tag updates
    const { categories, tags, ...dataToUpdate } = raw;
    const data = dataToUpdate;

    if (data.slug) {
      data.slug = await makeUniquePostSlug(data.slug, id);
    }

    if (categories && Array.isArray(categories)) {
      const cats = await prisma.category.findMany({ where: { id: { in: categories } } });
      data.categories = { set: cats.map(c => ({ id: c.id })) };
    }

    if (tags && Array.isArray(tags)) {
      const tgs = await prisma.tag.findMany({ where: { id: { in: tags } } });
      data.tags = { set: tgs.map(t => ({ id: t.id })) };
    }

    const updated = await prisma.post.update({ where: { id }, data, include: { author: true, categories: true, tags: true } });
    res.json({ success: true, data: { post: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const deleted = await prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: { post: deleted } });
  } catch (err) { next(err); }
}

module.exports = { list, getById, getBySlug, create, update, remove };
