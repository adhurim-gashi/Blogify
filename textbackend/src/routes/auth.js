const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { requireAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const perUserRateLimit = require('../middlewares/perUserRateLimit');
const { registerSchema, loginSchema, tokenSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(tokenSchema), authController.refresh);
router.post('/logout', validate(tokenSchema), authController.logout);
router.post('/forgot-password', perUserRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', perUserRateLimit({ max: 10, windowMs: 15 * 60 * 1000 }), validate(resetPasswordSchema), authController.resetPassword);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/resend-verification', requireAuth, perUserRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), authController.resendVerification);

module.exports = router;
