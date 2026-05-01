const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { email, username, password, name } = req.validated;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) return res.status(400).json({ success: false, error: 'User exists' });
    let role = await prisma.role.findUnique({ where: { name: 'Author' } });
    if (!role) {
      // fallback to Reader role; ensure at least one role exists
      role = await prisma.role.upsert({ where: { name: 'Reader' }, update: {}, create: { name: 'Reader' } });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, username, password: hashed, name, roleId: role ? role.id : undefined } });
    const access = signAccess({ id: user.id });
    const refresh = signRefresh({ id: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } });
    res.json({ success: true, data: { user: { id: user.id, email: user.email, username: user.username }, access, refresh } });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated;
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const access = signAccess({ id: user.id });
    const refresh = signRefresh({ id: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } });
    res.json({ success: true, data: { user: { id: user.id, email: user.email, username: user.username, role: user.role.name }, access, refresh } });
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const { refresh } = req.validated || req.body;
    if (!refresh) return res.status(400).json({ success: false, error: 'Refresh token required' });
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refresh } });
    if (!tokenRecord || tokenRecord.revoked) return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    if (new Date(tokenRecord.expiresAt) < new Date()) return res.status(401).json({ success: false, error: 'Refresh token expired' });
    const payload = verifyRefresh(refresh);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { role: true } });
    const access = signAccess({ id: user.id });
    res.json({ success: true, data: { access } });
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    const { refresh } = req.validated || req.body;
    if (!refresh) return res.status(400).json({ success: false, error: 'Refresh token required' });
    await prisma.refreshToken.updateMany({ where: { token: refresh }, data: { revoked: true } });
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout };
