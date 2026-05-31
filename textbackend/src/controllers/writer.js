const prisma = require('../utils/prisma');
const { recordAuditLog } = require('../utils/auditLog');

const PENDING = 'PENDING';
const APPROVED = 'APPROVED';
const REJECTED = 'REJECTED';

const applicationInclude = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: { select: { name: true } },
    },
  },
  reviewedBy: {
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
    },
  },
};

function serializeApplication(application) {
  return {
    ...application,
    user: application.user
      ? {
          ...application.user,
          role: application.user.role?.name || application.user.role,
        }
      : null,
  };
}

async function apply(req, res, next) {
  try {
    const roleName = req.user.role?.name || req.user.role;
    if (['Admin', 'Author'].includes(roleName)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'This account already has publishing access.',
      });
    }

    const pendingApplication = await prisma.writerApplication.findFirst({
      where: { userId: req.user.id, status: PENDING },
    });

    if (pendingApplication) {
      return res.status(409).json({
        success: false,
        data: { application: pendingApplication },
        message: 'You already have a pending writer application.',
      });
    }

    const application = await prisma.writerApplication.create({
      data: {
        userId: req.user.id,
        message: req.validated.message?.trim() || null,
      },
      include: applicationInclude,
    });

    res.status(201).json({
      success: true,
      data: { application: serializeApplication(application) },
      message: 'Writer application submitted successfully.',
    });
  } catch (err) {
    next(err);
  }
}

async function listPending(req, res, next) {
  try {
    const applications = await prisma.writerApplication.findMany({
      where: { status: PENDING },
      include: applicationInclude,
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    res.json({
      success: true,
      data: { applications: applications.map(serializeApplication) },
      message: 'Pending writer applications loaded.',
    });
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const { id } = req.validated;
    const application = await prisma.writerApplication.findUnique({
      where: { id },
      include: applicationInclude,
    });

    if (!application) {
      return res.status(404).json({ success: false, data: null, message: 'Application not found.' });
    }

    if (application.status !== PENDING) {
      return res.status(400).json({ success: false, data: null, message: 'Application has already been reviewed.' });
    }

    const authorRole = await prisma.role.upsert({
      where: { name: 'Author' },
      update: {},
      create: { name: 'Author' },
    });

    // Approval is transactional: the applicant becomes an Author only if the application state is also updated.
    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: application.userId },
        data: { roleId: authorRole.id },
      });

      return tx.writerApplication.update({
        where: { id },
        data: {
          status: APPROVED,
          reviewedAt: new Date(),
          reviewedById: req.user.id,
        },
        include: applicationInclude,
      });
    });

    res.json({
      success: true,
      data: { application: serializeApplication(updated) },
      message: 'Writer application approved.',
    });
    await recordAuditLog({ action: 'writer_application_approve', performedById: req.user.id, targetType: 'WriterApplication', targetId: id, details: { userId: application.userId } });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const { id, reason } = req.validated;
    const application = await prisma.writerApplication.findUnique({ where: { id } });

    if (!application) {
      return res.status(404).json({ success: false, data: null, message: 'Application not found.' });
    }

    if (application.status !== PENDING) {
      return res.status(400).json({ success: false, data: null, message: 'Application has already been reviewed.' });
    }

    const updated = await prisma.writerApplication.update({
      where: { id },
      data: {
        status: REJECTED,
        reviewNote: reason?.trim() || null,
        reviewedAt: new Date(),
        reviewedById: req.user.id,
      },
      include: applicationInclude,
    });

    res.json({
      success: true,
      data: { application: serializeApplication(updated) },
      message: 'Writer application rejected.',
    });
    await recordAuditLog({ action: 'writer_application_reject', performedById: req.user.id, targetType: 'WriterApplication', targetId: id, details: { userId: application.userId } });
  } catch (err) {
    next(err);
  }
}

module.exports = { apply, listPending, approve, reject };
