const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mediaController = require('../controllers/media');
const { requireAuth, requireRole } = require('../middlewares/auth');

const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, path.join(__dirname, '..', '..', 'uploads')); }, filename: function (req, file, cb) { const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-'); cb(null, name); } });
const maxSize = parseInt(process.env.MAX_UPLOAD_SIZE || '5242880');
const upload = multer({ storage, limits: { fileSize: maxSize }, fileFilter: (req, file, cb) => {
	const allowed = ['image/jpeg','image/png','image/gif','image/webp','video/mp4','application/pdf'];
	if (!allowed.includes(file.mimetype)) return cb(new Error('Unsupported file type'), false);
	cb(null, true);
}});
const { validate } = require('../middlewares/validate');
const { listMediaSchema } = require('../validation/media');
const perUserRateLimit = require('../middlewares/perUserRateLimit');

router.post('/', requireAuth, perUserRateLimit({ max: 30 }), upload.single('file'), mediaController.upload);
router.get('/', validate(listMediaSchema), mediaController.list);
const { idParam } = require('../validation/common');

// Delete media - only Admin/Author
router.delete('/:id', requireAuth, perUserRateLimit({ max: 20 }), requireRole('Admin','Author'), validate(idParam), mediaController.remove);

module.exports = router;
