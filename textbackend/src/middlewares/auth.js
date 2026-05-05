const prisma = require('../utils/prisma');
const { verifyAccess } = require('../utils/jwt');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, error: 'No authorization header' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Invalid token' });
    // Verify access token; if invalid or expired, jwt.verify will throw and be caught below
    const payload = verifyAccess(token);
    // Load user including role and disabled flag to enforce account status
    const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { role: true } });
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    // If account is disabled, deny access
    if (user.disabled) return res.status(403).json({ success: false, error: 'User account disabled' });
    // Attach user to request for downstream handlers and role checks
    req.user = user;
    next();
  } catch (err) {
    // Do not leak internal errors; return standardized unauthorized response
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
