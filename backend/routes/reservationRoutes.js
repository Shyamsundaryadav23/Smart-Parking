const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middleware/authMiddleware');

router.post('/reservations', authenticate, reservationController.bookSlot);
router.get('/users/:userId/reservations', authenticate, reservationController.getUserReservations);
router.delete('/reservations/:reservationId', authenticate, reservationController.cancelReservation);

module.exports = router;