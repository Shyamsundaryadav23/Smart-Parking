const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

// profile
router.get('/:id', authenticate, userController.getProfile);
router.put('/:id', authenticate, userController.updateProfile);

module.exports = router;
