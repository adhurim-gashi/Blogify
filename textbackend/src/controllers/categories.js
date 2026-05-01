const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');

async function list(req, res, next) {
  try {
    const cats = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { categories: cats } });
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
