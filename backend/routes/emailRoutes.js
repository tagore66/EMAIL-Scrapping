const express = require('express');
const { syncEmails, getEmails, reprocessEmails, getTelemetry } = require('../controllers/emailController');
const router = express.Router();

router.post('/sync', syncEmails);
router.post('/reprocess', reprocessEmails);
router.get('/telemetry', getTelemetry);
router.get('/', getEmails);

module.exports = router;
