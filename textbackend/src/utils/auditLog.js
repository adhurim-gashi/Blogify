const prisma = require('./prisma');

async function recordAuditLog({ action, performedById, targetType, targetId, details }) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        performedById: performedById || null,
        targetType,
        targetId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (err) {
    // Audit logging should not break the primary workflow, but failures must be visible.
    console.error('[audit-log] failed to record event', err);
  }
}

module.exports = { recordAuditLog };
