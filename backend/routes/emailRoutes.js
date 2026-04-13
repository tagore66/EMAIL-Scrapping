const express = require('express');
const { syncEmails, getEmails, reprocessEmails } = require('../controllers/emailController');
const router = express.Router();

router.post('/sync', syncEmails);
router.post('/reprocess', reprocessEmails);
router.get('/', getEmails);

module.exports = router;
