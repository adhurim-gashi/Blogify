const prisma = require('../utils/prisma');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function optimizeImage(file) {
  if (!imageTypes.has(file.mimetype)) {
    return {
      filepath: `/uploads/${file.filename}`,
      originalFilepath: `/uploads/${file.filename}`,
      optimizedFilepath: null,
      webpFilepath: null,
      optimizedSize: null,
      width: null,
      height: null,
    };
  }

  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  const originalPath = file.path;
  const parsed = path.parse(file.filename);
  const optimizedName = `${parsed.name}-optimized${file.mimetype === 'image/png' ? '.png' : '.jpg'}`;
  const webpName = `${parsed.name}.webp`;
  const optimizedPath = path.join(uploadsDir, optimizedName);
  const webpPath = path.join(uploadsDir, webpName);

  const metadata = await sharp(originalPath).metadata();

  if (file.mimetype === 'image/png') {
    await sharp(originalPath).rotate().resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(optimizedPath);
  } else {
    await sharp(originalPath).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(optimizedPath);
  }

  await sharp(originalPath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(webpPath);

  const optimizedStat = await fs.promises.stat(optimizedPath);

  return {
    filepath: `/uploads/${webpName}`,
    originalFilepath: `/uploads/${file.filename}`,
    optimizedFilepath: `/uploads/${optimizedName}`,
    webpFilepath: `/uploads/${webpName}`,
    optimizedSize: optimizedStat.size,
    width: metadata.width || null,
    height: metadata.height || null,
  };
}

async function upload(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'File required' });
    const { file, user } = req;
    const optimized = await optimizeImage(file);
    const record = await prisma.media.create({
      data: {
        filename: file.originalname,
        filepath: optimized.filepath,
        originalFilepath: optimized.originalFilepath,
        optimizedFilepath: optimized.optimizedFilepath,
        webpFilepath: optimized.webpFilepath,
        mimetype: file.mimetype,
        size: file.size,
        optimizedSize: optimized.optimizedSize,
        width: optimized.width,
        height: optimized.height,
        uploaderId: user?.id
      }
    });
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
    const paths = new Set([rec.filepath, rec.originalFilepath, rec.optimizedFilepath, rec.webpFilepath].filter(Boolean));
    for (const filepath of paths) {
      const full = path.join(__dirname, '..', '..', filepath.replace(/^\//, ''));
      fs.unlink(full, (err) => {
        if (err) console.warn('Failed removing file:', full, err.message);
      });
    }
    await prisma.media.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
}

module.exports = { upload, list, remove };
