const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');
const sanitizeHtml = require('sanitize-html');
const { recordAuditLog } = require('../utils/auditLog');

function publicPostWhere(extra = {}) {
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

function normalizeScheduleInput(input) {
  const isScheduled = Boolean(input.isScheduled);
  if (!isScheduled) {
    return { isScheduled: false, scheduledAt: null };
  }

  if (!input.scheduledAt) {
    const err = new Error('scheduledAt is required when scheduling a post.');
    err.status = 400;
    throw err;
  }

  const scheduledAt = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
    const err = new Error('scheduledAt must be a future date.');
    err.status = 400;
    throw err;
  }

  return { isScheduled: true, scheduledAt, status: 'DRAFT' };
}

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
    const roleName = req.user?.role?.name || req.user?.role;
    if (!['Admin', 'Author'].includes(roleName)) Object.assign(where, publicPostWhere());
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
    const post = await prisma.post.findFirst({
      where: publicPostWhere({ slug }),
      include: { author: true, categories: true, tags: true, media: true, comments: true }
    });
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });
    // increment views
    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
    res.json({ success: true, data: { post } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, content, excerpt, metaTitle, metaDescription, ogImage, status, categories = [], tags = [], isScheduled, scheduledAt } = req.validated;
    const cleanContent = sanitizeHtml(content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });
    const slug = await makeUniquePostSlug(title);
    const scheduleData = normalizeScheduleInput({ isScheduled, scheduledAt });
    const data = { title, content: cleanContent, excerpt, metaTitle, metaDescription, ogImage, slug, status: status || 'DRAFT', authorId: req.user.id, ...scheduleData };
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
    if (data.isScheduled) {
      await recordAuditLog({ action: 'post_schedule', performedById: req.user.id, targetType: 'Post', targetId: post.id, details: { scheduledAt: data.scheduledAt } });
    } else if (data.status === 'PUBLISHED') {
      await recordAuditLog({ action: 'post_publish', performedById: req.user.id, targetType: 'Post', targetId: post.id });
    }
    res.json({ success: true, data: { post } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const existingPost = await prisma.post.findUnique({ where: { id } });
    const raw = { ...(req.validated || req.body) };
    delete raw.id;
    if (raw.content) raw.content = sanitizeHtml(raw.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });

    // Handle category and tag updates
    const { categories, tags, ...dataToUpdate } = raw;
    const data = dataToUpdate;

    if (Object.prototype.hasOwnProperty.call(raw, 'isScheduled')) {
      Object.assign(data, normalizeScheduleInput(raw));
    } else if (raw.scheduledAt) {
      const err = new Error('Set isScheduled to true when providing scheduledAt.');
      err.status = 400;
      throw err;
    }

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
    if (existingPost && existingPost.status !== updated.status) {
      await recordAuditLog({
        action: updated.status === 'PUBLISHED' ? 'post_publish' : 'post_unpublish',
        performedById: req.user.id,
        targetType: 'Post',
        targetId: id,
        details: { from: existingPost.status, to: updated.status },
      });
    }
    if (updated.isScheduled && existingPost?.scheduledAt?.toISOString() !== updated.scheduledAt?.toISOString()) {
      await recordAuditLog({ action: 'post_schedule', performedById: req.user.id, targetType: 'Post', targetId: id, details: { scheduledAt: updated.scheduledAt } });
    }
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
