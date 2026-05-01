const prisma = require('../utils/prisma');

async function list(req, res, next) {
  try {
    const { page = 1, perPage = 20 } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({ skip, take, where: { deletedAt: null }, include: { role: true } }),
      prisma.user.count({ where: { deletedAt: null } })
    ]);
    res.json({ success: true, data: { users, meta: { total } } });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  res.json({ success: true, data: { user: req.user } });
}

async function get(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id, email, username, name, bio } = req.validated || { id: req.params.id, ...req.body };
    const data = {};
    if (email) data.email = email;
    if (username) data.username = username;
    if (name) data.name = name;
    if (bio) {
      const sanitizeHtml = require('sanitize-html');
      data.bio = sanitizeHtml(bio, { allowedTags: [], allowedAttributes: {} });
    }
    const updated = await prisma.user.update({ where: { id }, data });
    res.json({ success: true, data: { user: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const deleted = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: { user: deleted } });
  } catch (err) { next(err); }
}

module.exports = { list, me, get, update, remove };
