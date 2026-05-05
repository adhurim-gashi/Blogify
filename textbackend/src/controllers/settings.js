const prisma = require('../utils/prisma');

async function list(req, res, next) {
  try {
    // Support pagination for settings listing to satisfy global pagination requirement
    // Implements spec #12: Settings API and Additional Requirements: pagination
    const { page = 1, perPage = 50, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = q ? { key: { contains: q, mode: 'insensitive' } } : {};
    const [items, total] = await prisma.$transaction([
      prisma.setting.findMany({ where, skip, take, orderBy: { key: 'asc' } }),
      prisma.setting.count({ where })
    ]);
    res.json({ success: true, data: { settings: items, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { key, value } = req.validated || req.body;
    const rec = await prisma.setting.create({ data: { key, value } });
    res.json({ success: true, data: { setting: rec } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const data = req.validated || req.body;
    const updated = await prisma.setting.update({ where: { id }, data });
    res.json({ success: true, data: { setting: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    await prisma.setting.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
