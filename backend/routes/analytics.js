const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { validateDateRange } = require('../middleware/validate');

router.get('/generate', validateDateRange, analyticsController.generateAnalyticsReport);
router.get('/reports', analyticsController.getReports);

module.exports = router;