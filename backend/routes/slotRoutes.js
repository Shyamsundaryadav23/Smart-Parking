const express = require('express');
const router = express.Router();
const slotMonitoringController = require('../controllers/slotMonitoringController');

// don't require authentication for live status; it's safe read-only
router.get('/live/:lotId', slotMonitoringController.getLiveSlots);

module.exports = router;
