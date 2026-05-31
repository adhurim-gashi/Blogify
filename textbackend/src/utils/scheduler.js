const prisma = require('./prisma');
const { recordAuditLog } = require('./auditLog');

async function publishDueScheduledPosts() {
  const now = new Date();
  const duePosts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      isScheduled: true,
      scheduledAt: { lte: now },
    },
    select: { id: true, scheduledAt: true },
  });

  if (duePosts.length === 0) return;

  const result = await prisma.post.updateMany({
    where: {
      id: { in: duePosts.map(post => post.id) },
    },
    data: {
      status: 'PUBLISHED',
      isScheduled: false,
    },
  });

  if (result.count > 0) {
    console.info(`[scheduler] Published ${result.count} scheduled post(s).`);
    await Promise.all(duePosts.map(post => recordAuditLog({
      action: 'post_publish',
      performedById: null,
      targetType: 'Post',
      targetId: post.id,
      details: { source: 'scheduler', scheduledAt: post.scheduledAt },
    })));
  }
}

function startPostScheduler() {
  // Run once at startup and then every minute. This is intentionally small and
  // stateless so it remains safe for local development; production can replace
  // it with a queue/cron worker if multiple server instances are used.
  publishDueScheduledPosts().catch((err) => console.error('[scheduler] startup publish failed', err));
  const interval = setInterval(() => {
    publishDueScheduledPosts().catch((err) => console.error('[scheduler] publish failed', err));
  }, 60 * 1000);

  if (typeof interval.unref === 'function') interval.unref();
}

module.exports = { startPostScheduler, publishDueScheduledPosts };
