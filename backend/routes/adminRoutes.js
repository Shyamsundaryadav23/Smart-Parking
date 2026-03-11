const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorizeAdmin = require('../middleware/adminMiddleware');

// login doesn't require admin auth
router.post('/login', adminController.login);

// protected routes
router.get('/dashboard', authorizeAdmin, adminController.dashboardStats);
router.post('/parking-lots', authorizeAdmin, adminController.addParkingLot);
router.delete('/parking-lots/:lotId', authorizeAdmin, adminController.removeParkingLot);
router.post('/slots', authorizeAdmin, adminController.addSlot);
router.put('/slots/:slotId', authorizeAdmin, adminController.updateSlot);
router.get('/reservations', authorizeAdmin, adminController.viewReservations);
router.get('/users', authorizeAdmin, adminController.viewUsers);
router.delete('/users/:userId', authorizeAdmin, adminController.deleteUser);

module.exports = router;