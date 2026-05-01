const prisma = require('../utils/prisma');
const { verifyAccess } = require('../utils/jwt');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, error: 'No authorization header' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Invalid token' });
    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { role: true } });
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}

function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    if (!allowed.includes(req.user.role.name)) return res.status(403).json({ success: false, error: 'Forbidden' });
    next();
  };
}

module.exports = { requireAuth, requireRole };
