const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');
const sanitizeHtml = require('sanitize-html');

async function list(req, res, next) {
  try {
    const pages = await prisma.page.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { pages } });
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
    const slug = makeSlug(title);
    const page = await prisma.page.create({ data: { title, content: clean, slug } });
    res.json({ success: true, data: { page } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const raw = req.validated || req.body;
    if (raw.content) raw.content = sanitizeHtml(raw.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']), allowedAttributes: { a: ['href','name','target'], img: ['src','alt'] } });
    const data = raw;
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

module.exports = { list, getBySlug, create, update, remove };
