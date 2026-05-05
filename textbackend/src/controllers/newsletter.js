const prisma = require('../utils/prisma');

async function subscribe(req, res, next) {
  try {
    const { email } = req.validated || req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });
    const rec = await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
    res.json({ success: true, data: { subscriber: rec } });
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    // Pagination for subscriber listing (Admin-only endpoint)
    // Implements spec #11 and Additional Requirements: pagination
    const { page = 1, perPage = 50, q } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const where = q ? { email: { contains: q, mode: 'insensitive' } } : {};
    const [subs, total] = await prisma.$transaction([
      prisma.newsletterSubscriber.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.newsletterSubscriber.count({ where })
    ]);
    res.json({ success: true, data: { subscribers: subs, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

// Remove subscriber by id or email
// Implements spec #11: remove subscriber
async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    if (id) {
      await prisma.newsletterSubscriber.delete({ where: { id } });
      return res.json({ success: true, data: { id } });
    }
    const { email } = req.validated || req.body;
    if (email) {
      await prisma.newsletterSubscriber.delete({ where: { email } });
      return res.json({ success: true, data: { email } });
    }
    return res.status(400).json({ success: false, error: 'id or email required' });
  } catch (err) { next(err); }
}

module.exports = { subscribe, list, remove };
