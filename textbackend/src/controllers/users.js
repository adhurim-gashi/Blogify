const prisma = require('../utils/prisma');

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  disabled: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

async function list(req, res, next) {
  try {
    const { page = 1, perPage = 20 } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({ skip, take, where: { deletedAt: null }, select: userSelect, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where: { deletedAt: null } })
    ]);
    res.json({ success: true, data: { users, meta: { total } } });
  } catch (err) { next(err); }
}

async function me(req, res) {
  const user = { ...req.user };
  delete user.password;
  delete user.refreshTokens;
  res.json({ success: true, data: { user } });
}

async function get(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { id, email, username, name, bio } = req.validated || { id: req.params.id, ...req.body };
    if (req.user.role.name !== 'Admin' && req.user.id !== id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    const data = {};
    if (email !== undefined) data.email = email;
    if (username !== undefined) data.username = username;
    if (name !== undefined) data.name = name;
    if (bio !== undefined) {
      const sanitizeHtml = require('sanitize-html');
      data.bio = sanitizeHtml(bio, { allowedTags: [], allowedAttributes: {} });
    }
    const updated = await prisma.user.update({ where: { id }, data, select: userSelect });
    res.json({ success: true, data: { user: updated } });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const deleted = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() }, select: userSelect });
    res.json({ success: true, data: { user: deleted } });
  } catch (err) { next(err); }
}

// Disable a user account without deleting it (sets `disabled = true`)
// Implements spec #13: disable/activate user
async function disable(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.user.update({ where: { id }, data: { disabled: true }, select: userSelect });
    res.json({ success: true, data: { user: updated } });
  } catch (err) { next(err); }
}

// Activate (enable) a previously disabled user
async function activate(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const updated = await prisma.user.update({ where: { id }, data: { disabled: false }, select: userSelect });
    res.json({ success: true, data: { user: updated } });
  } catch (err) { next(err); }
}

module.exports = { list, me, get, update, remove, disable, activate };
