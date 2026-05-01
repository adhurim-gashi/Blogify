const prisma = require('../utils/prisma');

async function list(req, res, next) {
  try {
    const items = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
    res.json({ success: true, data: { settings: items } });
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
