const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.get('/parking-lots', parkingController.listParkingLots);
router.get('/parking-lots/:lotId/slots', parkingController.listSlots);

module.exports = router;