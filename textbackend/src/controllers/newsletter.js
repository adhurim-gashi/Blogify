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
    const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { subscribers: subs } });
  } catch (err) { next(err); }
}

module.exports = { subscribe, list };
