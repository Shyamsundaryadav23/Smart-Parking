const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middleware/authMiddleware');

/**
 * Middleware to ensure only regular users (not admins) can access user reservation endpoints
 */
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot access user reservation endpoints. Use admin routes instead.' });
  }
  next();
};

// User-only endpoints for booking, canceling their own reservations
router.post('/reservations', authenticate, userOnly, reservationController.bookSlot);
router.delete('/reservations/:reservationId', authenticate, userOnly, reservationController.cancelReservation);

// View user's own reservations (with role check in controller)
router.get('/users/:userId/reservations', authenticate, reservationController.getUserReservations);

module.exports = router;