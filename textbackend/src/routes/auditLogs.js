const express = require('express');
const router = express.Router();
const auditLogsController = require('../controllers/auditLogs');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { listAuditLogsSchema } = require('../validation/auditLogs');

router.get('/', requireAuth, requireRole('Admin'), validate(listAuditLogsSchema), auditLogsController.list);

module.exports = router;
