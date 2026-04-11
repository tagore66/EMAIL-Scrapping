const express = require('express');
const { getAnalytics, getTelemetry } = require('../controllers/analyticsController');
const router = express.Router();

router.get('/', getAnalytics);
router.get('/telemetry', getTelemetry);

module.exports = router;
