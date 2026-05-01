const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter');
const { validate } = require('../middlewares/validate');
const { subscribeSchema } = require('../validation/newsletter');

router.post('/subscribe', validate(subscribeSchema), newsletterController.subscribe);
router.get('/subscribers', newsletterController.list);

module.exports = router;
