const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/env');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

function sanitizeUsername(value) {
  const cleaned = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
  return cleaned.length >= 3 ? cleaned : `user_${cleaned || 'new'}`;
}

async function makeUniqueUsername(base) {
  const safeBase = sanitizeUsername(base);
  let username = safeBase;
  let index = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${safeBase}_${index++}`.slice(0, 32);
  }
  return username;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    disabled: user.disabled,
    emailVerified: user.emailVerified,
    role: user.role?.name || user.role,
  };
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashEmailVerificationToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function assignEmailVerification(userId, email) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashEmailVerificationToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: tokenHash,
      emailVerificationExpiresAt: expiresAt,
    },
  });

  // Replace this with an email provider in production; the database stores only the hash.
  console.info(`[email-verification] ${email} token=${token} expiresAt=${expiresAt.toISOString()}`);
  return { token, expiresAt };
}

async function register(req, res, next) {
  try {
    const { email, username, password, name } = req.validated;
    const normalizedEmail = email.trim().toLowerCase();
    const requestedUsername = username || normalizedEmail.split('@')[0] || name;
    const uniqueUsername = await makeUniqueUsername(requestedUsername);
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return res.status(400).json({ success: false, error: 'User exists' });
    // Public registration is reader-only; elevated roles must be assigned through trusted admin workflows.
    const role = await prisma.role.upsert({ where: { name: 'Reader' }, update: {}, create: { name: 'Reader' } });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, username: uniqueUsername, password: hashed, name, roleId: role.id, emailVerified: false },
      include: { role: true }
    });
    await assignEmailVerification(user.id, user.email);
    const access = signAccess({ id: user.id });
    const refresh = signRefresh({ id: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } });
    res.json({ success: true, data: { user: publicUser(user), access, refresh }, message: 'Registered successfully. Please verify your email before creating content.' });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated;
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    if (user.deletedAt || user.disabled) return res.status(403).json({ success: false, error: 'User account disabled' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const access = signAccess({ id: user.id });
    const refresh = signRefresh({ id: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await prisma.refreshToken.create({ data: { token: refresh, userId: user.id, expiresAt } });
    res.json({ success: true, data: { user: publicUser(user), access, refresh }, message: 'Logged in successfully' });
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    // Validate input
    const { refresh } = req.validated || req.body;
    if (!refresh) return res.status(400).json({ success: false, error: 'Refresh token required' });

    // Lookup the token in DB to ensure it's valid and not revoked
    // Implements spec #3: refresh token rotation/blacklisting
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refresh } });
    if (!tokenRecord || tokenRecord.revoked) return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    if (new Date(tokenRecord.expiresAt) < new Date()) return res.status(401).json({ success: false, error: 'Refresh token expired' });

    // Verify cryptographic signature
    const payload = verifyRefresh(refresh);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { role: true } });
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    if (user.disabled) return res.status(403).json({ success: false, error: 'User disabled' });

    // ROTATION: revoke the old refresh token and issue a new refresh token
    // This prevents reuse (replay) of refresh tokens and fulfills spec recommendation
    await prisma.refreshToken.updateMany({ where: { token: refresh }, data: { revoked: true } });

    // Create new refresh token record and new access token
    const newRefresh = signRefresh({ id: user.id });
    const newAccess = signAccess({ id: user.id });
    const expiresAt = new Date(Date.now() + parseInt(process.env.JWT_REFRESH_TTL_MS || (7 * 24 * 3600 * 1000)));
    await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } });

    // Return both new access and rotated refresh token to the client
    res.json({ success: true, data: { access: newAccess, refresh: newRefresh } });
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    const { refresh } = req.validated || req.body;
    if (!refresh) return res.status(400).json({ success: false, error: 'Refresh token required' });
    // Revoke the provided refresh token so it cannot be used again
    // Implements spec #3: logout should invalidate refresh tokens
    await prisma.refreshToken.updateMany({ where: { token: refresh }, data: { revoked: true } });
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const email = req.validated.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    const publicMessage = 'If an account exists for this email, a reset link will be sent.';

    if (!user || user.deletedAt || user.disabled) {
      return res.json({ success: true, data: null, message: publicMessage });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + config.passwordResetTtlMs);

    // Store only the hash; the raw token is shown once here until an email provider is configured.
    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      }),
    ]);

    console.info(`[password-reset] ${email} token=${token} expiresAt=${expiresAt.toISOString()}`);
    res.json({ success: true, data: null, message: publicMessage });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.validated;
    const tokenHash = hashResetToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date() || resetToken.user.disabled || resetToken.user.deletedAt) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Reset token is invalid or expired.',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Invalidate active refresh sessions so old devices must re-authenticate with the new password.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    res.json({ success: true, data: null, message: 'Password reset successfully.' });
  } catch (err) {
    next(err);
  }
}

async function resendVerification(req, res, next) {
  try {
    if (req.user.emailVerified) {
      return res.json({ success: true, data: null, message: 'Email is already verified.' });
    }

    await assignEmailVerification(req.user.id, req.user.email);
    res.json({ success: true, data: null, message: 'Verification email sent.' });
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const tokenHash = hashEmailVerificationToken(req.validated.token);
    const user = await prisma.user.findUnique({ where: { emailVerificationToken: tokenHash } });

    if (!user || !user.emailVerificationExpiresAt || user.emailVerificationExpiresAt <= new Date()) {
      return res.status(400).json({ success: false, data: null, message: 'Verification token is invalid or expired.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    });

    res.json({ success: true, data: null, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, resendVerification, verifyEmail };
