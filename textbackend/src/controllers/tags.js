const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');

async function list(req, res, next) {
  try {
    // Add pagination and optional search for tags to satisfy list endpoint requirement
    // Implements spec: #6 Tags API and Additional Requirements: pagination
    const { page = 1, perPage = 20, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
    const [tags, total] = await prisma.$transaction([
      prisma.tag.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.tag.count({ where })
    ]);
    res.json({ success: true, data: { tags, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name } = req.validated || req.body;
    const tag = await prisma.tag.create({ data: { name } });
    res.json({ success: true, data: { tag } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const data = req.validated || req.body;
    const updated = await prisma.tag.update({ where: { id }, data });
    res.json({ success: true, data: { tag: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    await prisma.tag.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
