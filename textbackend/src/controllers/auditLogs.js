const prisma = require('../utils/prisma');

async function list(req, res, next) {
  try {
    const { page = '1', perPage = '50', action, targetType, performedById } = req.validated || req.query;
    const take = Math.min(parseInt(perPage, 10) || 50, 100);
    const skip = ((parseInt(page, 10) || 1) - 1) * take;
    const where = {};

    if (action) where.action = action;
    if (targetType) where.targetType = targetType;
    if (performedById) where.performedById = performedById;

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        take,
        skip,
        orderBy: { timestamp: 'desc' },
        include: { performedBy: { select: { id: true, email: true, username: true, name: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ success: true, data: { logs, meta: { total } } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
