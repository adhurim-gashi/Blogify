const prisma = require('../utils/prisma');
const path = require('path');
const fs = require('fs');

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
    // Support pagination for media listing (implements spec #10 and global pagination requirement)
    const { page = 1, perPage = 20 } = req.validated || req.query;
    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;
    const [items, total] = await prisma.$transaction([
      prisma.media.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.media.count()
    ]);
    res.json({ success: true, data: { media: items, meta: { total, page: parseInt(page), perPage: take } } });
  } catch (err) { next(err); }
}

// Delete media record and remove file from disk
// Implements spec #10: Media API - delete media
async function remove(req, res, next) {
  try {
    const { id } = req.validated || req.params;
    const rec = await prisma.media.findUnique({ where: { id } });
    if (!rec) return res.status(404).json({ success: false, error: 'Not found' });
    // remove file from uploads folder if exists
    const full = path.join(__dirname, '..', '..', rec.filepath.replace(/^\//, ''));
    fs.unlink(full, (err) => {
      // If unlink fails, log but continue to remove DB record to avoid orphan references
      if (err) console.warn('Failed removing file:', full, err.message);
    });
    await prisma.media.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
}

module.exports = { upload, list, remove };
