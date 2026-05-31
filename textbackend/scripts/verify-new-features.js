const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { publishDueScheduledPosts } = require('../src/utils/scheduler');

const projectRoot = path.resolve(__dirname, '..');
const port = process.env.FEATURE_VERIFY_PORT || '4010';
const rootUrl = `http://127.0.0.1:${port}`;
const apiUrl = `${rootUrl}/api`;
const password = 'VerifyPass123!';
const runId = `feature-${Date.now()}`;
const testDomain = 'verify.blogify.local';
const prisma = new PrismaClient();

let server;
let serverOutput = '';
let serverErrorOutput = '';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function startServer() {
  server = spawn(process.execPath, ['src/server.js'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: port,
      RATE_LIMIT_MAX: '5000',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', chunk => {
    const text = chunk.toString();
    serverOutput += text;
    process.stdout.write(text);
  });
  server.stderr.on('data', chunk => {
    const text = chunk.toString();
    serverErrorOutput += text;
    process.stderr.write(text);
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Backend exited early with code ${server.exitCode}\n${serverErrorOutput}`);
    }
    try {
      const response = await fetch(`${rootUrl}/health`);
      if (response.ok) return;
    } catch {
      // Keep polling until the Express listener is ready.
    }
    await sleep(500);
  }

  throw new Error(`Backend did not become healthy on port ${port}.\n${serverErrorOutput}`);
}

async function stopServer() {
  if (!server || server.killed) return;
  server.kill();
  await sleep(500);
}

async function request(pathname, options = {}) {
  const headers = { ...(options.headers || {}) };
  let body = options.body;
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (Object.prototype.hasOwnProperty.call(options, 'json')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.json);
  }

  const response = await fetch(`${apiUrl}${pathname}`, {
    method: options.method || 'GET',
    headers,
    body,
  });
  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') && text ? JSON.parse(text) : text;
  const expected = options.expect || [200];

  if (!expected.includes(response.status)) {
    throw new Error(`${options.method || 'GET'} ${pathname} expected ${expected.join('/')} but got ${response.status}: ${text}`);
  }

  return { status: response.status, body: payload, text };
}

async function requestRoot(pathname, options = {}) {
  const response = await fetch(`${rootUrl}${pathname}`, { method: options.method || 'GET' });
  const text = await response.text();
  const expected = options.expect || [200];
  if (!expected.includes(response.status)) {
    throw new Error(`${options.method || 'GET'} ${pathname} expected ${expected.join('/')} but got ${response.status}: ${text}`);
  }
  return { status: response.status, text };
}

async function waitForVerificationToken(email) {
  const pattern = new RegExp(`\\[email-verification\\]\\s+${escapeRegExp(email)}\\s+token=([a-f0-9]+)`, 'i');
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const match = serverOutput.match(pattern);
    if (match) return match[1];
    await sleep(250);
  }
  throw new Error(`Verification token for ${email} was not logged by the backend.`);
}

async function ensureRole(name) {
  return prisma.role.upsert({ where: { name }, update: {}, create: { name } });
}

async function ensureUser({ email, username, roleName, verified = true }) {
  const role = await ensureRole(roleName);
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: {
      username,
      password: hashed,
      roleId: role.id,
      disabled: false,
      deletedAt: null,
      emailVerified: verified,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    },
    create: {
      email,
      username,
      password: hashed,
      roleId: role.id,
      emailVerified: verified,
    },
    include: { role: true },
  });
}

async function cleanupVerificationData() {
  const users = await prisma.user.findMany({
    where: { email: { endsWith: `@${testDomain}` } },
    select: { id: true },
  });
  const userIds = users.map(user => user.id);
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { startsWith: 'Feature ' } },
        ...(userIds.length ? [{ authorId: { in: userIds } }] : []),
      ],
    },
    select: { id: true },
  });
  const postIds = posts.map(post => post.id);
  const comments = (postIds.length || userIds.length)
    ? await prisma.comment.findMany({
        where: {
          OR: [
            ...(postIds.length ? [{ postId: { in: postIds } }] : []),
            ...(userIds.length ? [{ authorId: { in: userIds } }] : []),
          ],
        },
        select: { id: true },
      })
    : [];
  const commentIds = comments.map(comment => comment.id);
  const applications = userIds.length
    ? await prisma.writerApplication.findMany({ where: { userId: { in: userIds } }, select: { id: true } })
    : [];
  const applicationIds = applications.map(application => application.id);
  const auditTargetIds = [...postIds, ...commentIds, ...applicationIds];

  if (userIds.length || auditTargetIds.length) {
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          ...(userIds.length ? [{ performedById: { in: userIds } }] : []),
          ...(auditTargetIds.length ? [{ targetId: { in: auditTargetIds } }] : []),
        ],
      },
    });
  }
  if (commentIds.length || userIds.length) {
    await prisma.commentReaction.deleteMany({
      where: {
        OR: [
          ...(commentIds.length ? [{ commentId: { in: commentIds } }] : []),
          ...(userIds.length ? [{ userId: { in: userIds } }] : []),
        ],
      },
    });
  }
  if (commentIds.length) await prisma.comment.deleteMany({ where: { id: { in: commentIds } } });
  if (applicationIds.length) await prisma.writerApplication.deleteMany({ where: { id: { in: applicationIds } } });
  if (userIds.length) {
    await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.passwordResetToken.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.media.deleteMany({ where: { uploaderId: { in: userIds } } });
  }
  if (postIds.length) await prisma.post.deleteMany({ where: { id: { in: postIds } } });
  await prisma.page.deleteMany({ where: { title: { startsWith: 'Feature Verify Page feature-' } } });
  await prisma.newsletterSubscriber.deleteMany({ where: { email: { endsWith: `@${testDomain}` } } });
  if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.category.deleteMany({ where: { name: { startsWith: 'Feature Category feature-' } } });
  await prisma.tag.deleteMany({ where: { name: { startsWith: 'Feature Tag feature-' } } });
}

async function login(email) {
  const response = await request('/auth/login', {
    method: 'POST',
    json: { email, password },
    expect: [200],
  });
  assert(response.body.success === true, `Login failed for ${email}`);
  return response.body.data.access;
}

function futureIso(minutes = 30) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function pastDate(minutes = 30) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

async function round1() {
  console.log('\nRound 1: basic feature functionality');
  const adminEmail = `admin-${runId}@${testDomain}`;
  const authorEmail = `author-${runId}@${testDomain}`;
  const readerEmail = `reader-${runId}@${testDomain}`;
  await ensureUser({ email: adminEmail, username: `admin_${runId}`, roleName: 'Admin' });
  await ensureUser({ email: authorEmail, username: `author_${runId}`, roleName: 'Author' });
  await ensureUser({ email: readerEmail, username: `reader_${runId}`, roleName: 'Reader' });

  const adminToken = await login(adminEmail);
  const authorToken = await login(authorEmail);
  const readerToken = await login(readerEmail);

  const signupEmail = `signup-${runId}@${testDomain}`;
  const signup = await request('/auth/register', {
    method: 'POST',
    json: { email: signupEmail, username: `signup_${runId}`, password, name: 'Verification Signup' },
    expect: [200],
  });
  assert(signup.body.data.user.role === 'Reader', 'Signup did not assign Reader role.');
  assert(signup.body.data.user.emailVerified === false, 'Signup user should start unverified.');

  const rawToken = await waitForVerificationToken(signupEmail);
  const signupUser = await prisma.user.findUnique({ where: { email: signupEmail }, include: { role: true } });
  assert(signupUser.role.name === 'Reader', 'Registered user role was not Reader in the database.');
  assert(signupUser.emailVerificationToken && signupUser.emailVerificationToken !== rawToken, 'Verification token was not stored as a hash.');
  await request('/auth/verify-email', { method: 'POST', json: { token: rawToken }, expect: [200] });
  const verifiedSignupUser = await prisma.user.findUnique({ where: { email: signupEmail } });
  assert(verifiedSignupUser.emailVerified === true, 'Email verification did not persist.');

  const category = (await request('/categories', {
    method: 'POST',
    token: adminToken,
    json: { name: `Feature Category ${runId}` },
    expect: [200],
  })).body.data.category;
  const tag = (await request('/tags', {
    method: 'POST',
    token: adminToken,
    json: { name: `Feature Tag ${runId}` },
    expect: [200],
  })).body.data.tag;

  const postHtml = '<h2>TipTap Heading</h2><p><strong>Rich</strong> content with <em>formatting</em>.</p><blockquote>Quoted text</blockquote>';
  const post = (await request('/posts', {
    method: 'POST',
    token: adminToken,
    json: {
      title: `Feature Verify Post ${runId}`,
      content: postHtml,
      excerpt: 'Feature verification excerpt',
      status: 'PUBLISHED',
      categories: [category.id],
      tags: [tag.id],
      metaTitle: 'Feature Verify Meta',
      metaDescription: 'Feature verify meta description',
      ogImage: 'https://example.com/feature.png',
    },
    expect: [200],
  })).body.data.post;

  const savedPost = await prisma.post.findUnique({ where: { id: post.id }, include: { categories: true, tags: true } });
  assert(savedPost.content.includes('<h2>TipTap Heading</h2>') && savedPost.content.includes('<strong>Rich</strong>'), 'Rich post HTML was not persisted.');
  assert(savedPost.metaTitle === 'Feature Verify Meta' && savedPost.ogImage, 'SEO metadata was not persisted.');
  assert(savedPost.categories.length === 1 && savedPost.tags.length === 1, 'Post category/tag relations were not persisted.');

  const pageHtml = '<h2>Page Heading</h2><p><strong>Page</strong> rich text.</p>';
  const page = (await request('/pages', {
    method: 'POST',
    token: adminToken,
    json: { title: `Feature Verify Page ${runId}`, content: pageHtml },
    expect: [200],
  })).body.data.page;
  const savedPage = await prisma.page.findUnique({ where: { id: page.id } });
  assert(savedPage.content.includes('<strong>Page</strong>'), 'Rich page HTML was not persisted.');

  await request('/home/featured-posts', { expect: [200] });
  await request('/home/recent-posts', { expect: [200] });
  await request('/home/stats', { expect: [200] });
  await request('/home/newsletter/subscribe', {
    method: 'POST',
    json: { email: `newsletter-${runId}@${testDomain}` },
    expect: [201],
  });

  console.log('Round 1 passed.');
  return { adminToken, authorToken, readerToken, post, category, tag };
}

async function round2(context) {
  console.log('\nRound 2: integration, roles, scheduling, comments, reactions');
  const unverifiedEmail = `unverified-${runId}@${testDomain}`;
  const signup = await request('/auth/register', {
    method: 'POST',
    json: { email: unverifiedEmail, username: `unverified_${runId}`, password, name: 'Unverified User' },
    expect: [200],
  });
  const unverifiedToken = signup.body.data.access;

  await request('/writer/apply', {
    method: 'POST',
    token: unverifiedToken,
    json: { message: 'I would like to write.' },
    expect: [403],
  });
  await request('/comments', {
    method: 'POST',
    token: unverifiedToken,
    json: { postId: context.post.id, content: 'Blocked unverified comment.' },
    expect: [403],
  });

  const verificationToken = await waitForVerificationToken(unverifiedEmail);
  await request('/auth/verify-email', { method: 'POST', json: { token: verificationToken }, expect: [200] });
  const applyResponse = await request('/writer/apply', {
    method: 'POST',
    token: unverifiedToken,
    json: { message: 'I would like to write for Blogify.' },
    expect: [201],
  });
  const applicationId = applyResponse.body.data.application.id;
  await request(`/writer/applications/${applicationId}/approve`, {
    method: 'PATCH',
    token: context.adminToken,
    expect: [200],
  });
  const promotedUser = await prisma.user.findUnique({ where: { email: unverifiedEmail }, include: { role: true } });
  assert(promotedUser.role.name === 'Author', 'Approved writer application did not promote user to Author.');

  const scheduled = (await request('/posts', {
    method: 'POST',
    token: context.adminToken,
    json: {
      title: `Feature Scheduled Future ${runId}`,
      content: '<p>Scheduled future post.</p>',
      excerpt: 'Future scheduled post',
      status: 'PUBLISHED',
      isScheduled: true,
      scheduledAt: futureIso(60),
    },
    expect: [200],
  })).body.data.post;
  assert(scheduled.status === 'DRAFT' && scheduled.isScheduled === true, 'Scheduled post was not kept as draft before publish time.');
  await request(`/posts/${scheduled.slug}`, { expect: [404] });
  const recent = await request('/home/recent-posts', { expect: [200] });
  assert(!recent.body.data.posts.some(item => item.id === scheduled.id), 'Scheduled future post leaked into recent posts.');
  await request('/comments', {
    method: 'POST',
    token: context.readerToken,
    json: { postId: scheduled.id, content: 'This should not be accepted.' },
    expect: [404],
  });

  const parentComment = (await request('/comments', {
    method: 'POST',
    token: context.readerToken,
    json: { postId: context.post.id, content: 'Parent comment from verified reader.' },
    expect: [200],
  })).body.data.comment;
  await request(`/comments/${parentComment.id}/approve`, {
    method: 'POST',
    token: context.adminToken,
    expect: [200],
  });
  const reply = (await request('/comments', {
    method: 'POST',
    token: context.readerToken,
    json: { postId: context.post.id, parentId: parentComment.id, content: 'Nested reply from verified reader.' },
    expect: [200],
  })).body.data.comment;
  await request(`/comments/${reply.id}/approve`, {
    method: 'POST',
    token: context.adminToken,
    expect: [200],
  });
  const comments = await request(`/comments/post/${context.post.id}`, { expect: [200] });
  assert(comments.body.data.comments.some(item => item.id === parentComment.id), 'Approved parent comment was not listed publicly.');
  assert(comments.body.data.comments.some(item => item.id === reply.id && item.parentId === parentComment.id), 'Approved nested reply was not listed publicly.');

  const liked = await request(`/comments/${parentComment.id}/react`, {
    method: 'POST',
    token: context.readerToken,
    json: {},
    expect: [200],
  });
  assert(liked.body.data.liked === true && liked.body.data.reactionCount === 1, 'Comment like did not persist.');
  const unliked = await request(`/comments/${parentComment.id}/react`, {
    method: 'POST',
    token: context.readerToken,
    json: {},
    expect: [200],
  });
  assert(unliked.body.data.liked === false && unliked.body.data.reactionCount === 0, 'Comment unlike did not remove reaction.');

  console.log('Round 2 passed.');
  return { scheduled };
}

async function round3(context) {
  console.log('\nRound 3: edge cases and public/protected boundaries');
  await request('/posts', {
    method: 'POST',
    token: context.adminToken,
    json: {
      title: `Feature Past Schedule ${runId}`,
      content: '<p>Invalid schedule.</p>',
      isScheduled: true,
      scheduledAt: pastDate(10).toISOString(),
    },
    expect: [400],
  });

  const draft = (await request('/posts', {
    method: 'POST',
    token: context.adminToken,
    json: {
      title: `Feature Draft ${runId}`,
      content: '<p>Draft content.</p>',
      status: 'DRAFT',
    },
    expect: [200],
  })).body.data.post;
  await request(`/posts/${draft.slug}`, { expect: [404] });
  await request('/audit-logs', { token: context.authorToken, expect: [403] });
  const auditLogs = await request('/audit-logs', { token: context.adminToken, expect: [200] });
  assert(Array.isArray(auditLogs.body.data.logs), 'Admin audit log list did not return logs.');

  const sitemap = await requestRoot('/sitemap.xml', { expect: [200] });
  assert(sitemap.text.includes(context.post.slug), 'Sitemap does not include published post.');
  assert(!sitemap.text.includes(context.scheduled.slug), 'Sitemap leaked scheduled future post.');
  assert(!sitemap.text.includes(draft.slug), 'Sitemap leaked draft post.');

  const stats = await request('/home/stats', { expect: [200] });
  assert(typeof stats.body.data.stats.totalPosts === 'number', 'Homepage stats did not return numeric post count.');
  await request('/home/featured-posts', { expect: [200] });
  await request('/home/recent-posts', { expect: [200] });

  console.log('Round 3 passed.');
  return { draft };
}

async function round4(context) {
  console.log('\nRound 4: end-to-end scheduler, audit, and media optimization');
  const adminUser = await prisma.user.findFirst({ where: { email: { contains: `admin-${runId}` } } });
  const duePost = await prisma.post.create({
    data: {
      title: `Feature Due Scheduled ${runId}`,
      slug: `feature-due-scheduled-${runId}`,
      excerpt: 'Due scheduled post',
      content: '<p>Due scheduled post.</p>',
      status: 'DRAFT',
      isScheduled: true,
      scheduledAt: pastDate(5),
      authorId: adminUser.id,
    },
  });

  await publishDueScheduledPosts();
  const publishedDuePost = await prisma.post.findUnique({ where: { id: duePost.id } });
  assert(publishedDuePost.status === 'PUBLISHED' && publishedDuePost.isScheduled === false, 'Scheduler did not publish due post.');

  const auditLogs = await request('/audit-logs', { token: context.adminToken, expect: [200] });
  const auditActions = auditLogs.body.data.logs.map(log => log.action);
  assert(auditActions.includes('post_publish'), 'Post publish audit log missing.');
  assert(auditActions.includes('comment_approve'), 'Comment moderation audit log missing.');
  assert(auditActions.includes('writer_application_approve'), 'Writer approval audit log missing.');

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
    'base64'
  );
  const form = new FormData();
  form.append('file', new Blob([png], { type: 'image/png' }), `feature-${runId}.png`);
  const uploadResponse = await fetch(`${apiUrl}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${context.adminToken}` },
    body: form,
  });
  const uploadBody = await uploadResponse.json();
  assert(uploadResponse.status === 200 && uploadBody.success === true, `Media upload failed: ${JSON.stringify(uploadBody)}`);
  const media = uploadBody.data.media;
  assert(media.webpFilepath && media.optimizedFilepath && media.optimizedSize > 0, 'Image optimization metadata was not stored.');
  for (const filepath of [media.originalFilepath, media.optimizedFilepath, media.webpFilepath]) {
    assert(fs.existsSync(path.join(projectRoot, filepath.replace(/^\//, ''))), `Expected media file missing: ${filepath}`);
  }

  await request(`/media/${media.id}`, {
    method: 'DELETE',
    token: context.adminToken,
    expect: [200],
  });
  const deletedMedia = await prisma.media.findUnique({ where: { id: media.id } });
  assert(!deletedMedia, 'Media record was not deleted.');

  console.log('Round 4 passed.');
}

async function run() {
  let completed = false;
  try {
    await cleanupVerificationData();
    await startServer();
    const context = await round1();
    const round2State = await round2(context);
    await round3({ ...context, ...round2State });
    await round4({ ...context, ...round2State });
    completed = true;
    console.log('\nAll four verification rounds passed.');
  } finally {
    await stopServer();
    if (completed && process.env.KEEP_VERIFY_DATA !== '1') {
      await cleanupVerificationData();
    }
    await prisma.$disconnect();
  }
}

run().catch(async err => {
  console.error('\nVerification failed:');
  console.error(err);
  await stopServer();
  await prisma.$disconnect();
  process.exit(1);
});
