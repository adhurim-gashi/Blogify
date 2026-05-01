const prisma = require('../utils/prisma');
const { makeSlug } = require('../utils/slugify');

async function list(req, res, next) {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { tags } });
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
