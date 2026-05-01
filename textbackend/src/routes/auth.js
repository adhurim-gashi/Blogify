const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema, tokenSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(tokenSchema), authController.refresh);
router.post('/logout', validate(tokenSchema), authController.logout);

module.exports = router;
