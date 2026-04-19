const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authMiddleware');

/**
 * Middleware to ensure only regular users (not admins) can access user payment endpoints
 */
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot access user payment endpoints' });
  }
  next();
};

// User-only endpoints for payment
// Create Razorpay order
router.post('/payment/create-order', authenticate, userOnly, paymentController.createOrder);

// Verify payment (called after Razorpay checkout)
router.post('/payment/verify', authenticate, userOnly, paymentController.verifyPayment);

module.exports = router;
