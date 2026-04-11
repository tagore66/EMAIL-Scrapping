const express = require('express');
const { syncEmails, getEmails } = require('../controllers/emailController');
const router = express.Router();

router.post('/sync', syncEmails);
router.get('/', getEmails);

module.exports = router;
