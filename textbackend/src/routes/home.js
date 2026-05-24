const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const { validate } = require('../middlewares/validate');
const { subscribeSchema } = require('../validation/newsletter');

// Public homepage data endpoints. These intentionally have no JWT or role middleware.
router.get('/featured-posts', homeController.featuredPosts);
router.get('/stats', homeController.stats);
router.get('/recent-posts', homeController.recentPosts);
router.post('/newsletter/subscribe', validate(subscribeSchema), homeController.subscribe);

module.exports = router;
