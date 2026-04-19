const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

/**
 * Middleware to ensure only regular users (not admins) can access user endpoints
 */
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot access user endpoints' });
  }
  next();
};

// profile (user-only endpoints)
router.get('/:id', authenticate, userOnly, userController.getProfile);
router.put('/:id', authenticate, userOnly, userController.updateProfile);

module.exports = router;
