const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');

async function list(req, res, next) {
  try {
    // Support pagination and search for categories
    // Implements spec: #5 Categories API and Additional Requirements: pagination
    const { page = 1, perPage = 20, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
    const [cats, total] = await prisma.$transaction([
      prisma.category.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.category.count({ where })
    ]);
    res.json({ success: true, data: { categories: cats, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name } = req.validated;
    const slug = makeSlug(name);
    const cat = await prisma.category.create({ data: { name, slug } });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const data = req.validated || req.body;
    const updated = await prisma.category.update({ where: { id }, data });
    res.json({ success: true, data: { category: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
