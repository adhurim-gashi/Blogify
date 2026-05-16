const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');
const sanitizeHtml = require('sanitize-html');

async function makeUniquePageSlug(value, currentId) {
  const base = makeSlug(value) || 'page';
  let slug = base;
  let index = 1;
  while (true) {
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${index++}`;
  }
}

async function list(req, res, next) {
  try {
    // Implement pagination for pages list per Additional Requirements
    // Implements spec: #9 Pages API and requirement: pagination
    const { page = 1, perPage = 20, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = { deletedAt: null };
    if (q) where.AND = [{ OR: [{ title: { contains: q } }, { content: { contains: q } }] }];
    const [pages, total] = await prisma.$transaction([
      prisma.page.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.page.count({ where })
    ]);
    res.json({ success: true, data: { pages, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { page } });
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const { slug } = req.validated || req.params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { page } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, content } = req.validated || req.body;
    const clean = sanitizeHtml(content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });
    const slug = await makeUniquePageSlug(title);
    const page = await prisma.page.create({ data: { title, content: clean, slug } });
    res.json({ success: true, data: { page } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    // Allow partial updates validated via Zod in routes
    const raw = { ...(req.validated || req.body) };
    delete raw.id;
    if (raw.content) raw.content = sanitizeHtml(raw.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });
    const data = raw;
    if (data.slug) {
      data.slug = await makeUniquePageSlug(data.slug, id);
    }
    const updated = await prisma.page.update({ where: { id }, data });
    res.json({ success: true, data: { page: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const deleted = await prisma.page.update({ where: { id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: { page: deleted } });
  } catch (err) { next(err); }
}

module.exports = { list, getById, getBySlug, create, update, remove };
