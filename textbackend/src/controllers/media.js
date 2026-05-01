const prisma = require('../utils/prisma');
const path = require('path');

async function upload(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'File required' });
    const { file, user } = req;
    const record = await prisma.media.create({ data: { filename: file.originalname, filepath: `/uploads/${file.filename}`, mimetype: file.mimetype, size: file.size, uploaderId: user?.id } });
    res.json({ success: true, data: { media: record } });
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: { media: items } });
  } catch (err) { next(err); }
}

module.exports = { upload, list };
