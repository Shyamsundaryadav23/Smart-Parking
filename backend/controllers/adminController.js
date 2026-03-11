const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const parkingLotModel = require('../models/parkingLotModel');
const slotModel = require('../models/slotModel');
const reservationModel = require('../models/reservationModel');

// Admin login (same as user but role check)
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await userModel.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Dashboard statistics
async function dashboardStats(req, res) {
  try {
    const lots = await parkingLotModel.getAllParkingLots();
    const reservations = await reservationModel.getAllReservations();
    const users = await userModel.getAllUsers();

    const allSlots = [];
    for (const lot of lots) {
      try {
        const lotSlots = await slotModel.getSlotsByLot(lot.lot_id);
        allSlots.push(...lotSlots);
      } catch {}
    }

    const totalSlots = allSlots.length;
    const availableSlots = allSlots.filter(s => s.status === 'available').length;
    const occupiedSlots = allSlots.filter(s => s.status === 'occupied').length;
    const reservedSlots = allSlots.filter(s => s.status === 'reserved').length;
    const activeReservations = reservations.filter(r => r.status === 'active').length;

    res.json({
      total_lots: lots.length,
      total_slots: totalSlots,
      available_slots: availableSlots,
      occupied_slots: occupiedSlots,
      reserved_slots: reservedSlots,
      active_reservations: activeReservations,
      total_users: users.filter(u => u.role === 'user').length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to collect stats' });
  }
}

// Helper: generate row-based slots
function generateRowSlots(totalSlots) {
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const slotsPerRow = 4;
  const slots = [];
  let rowIndex = 0;

  for (let i = 0; i < totalSlots; i++) {
    const rowLetter = rows[rowIndex];
    const position = (i % slotsPerRow) + 1;
    const label = `${rowLetter}${position}`;
    slots.push({
      slot_number: i + 1,
      label
    });
    if ((i + 1) % slotsPerRow === 0) rowIndex++;
  }
  return slots;
}

// Add a new parking lot with row-based slots
async function addParkingLot(req, res) {
  try {
    const { name, location, city, total_slots } = req.body;
    if (!name || !location || !city) {
      return res.status(400).json({ message: 'name, location and city required' });
    }

    const lot = await parkingLotModel.createParkingLot({ name, location, city, total_slots });

    if (total_slots && Number(total_slots) > 0) {
      const total = Number(total_slots);
      const generatedSlots = generateRowSlots(total);

      const promises = generatedSlots.map(slot =>
        slotModel.createSlot({
          lot_id: lot.lot_id,
          slot_number: slot.slot_number,
          label: slot.label,
          status: 'available'
        })
      );
      await Promise.all(promises);
    }

    res.status(201).json(lot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add lot' });
  }
}

// Add a single slot (row-based label generated automatically)
async function addSlot(req, res) {
  try {
    const { lot_id, slot_number } = req.body;
    if (!lot_id || !slot_number) {
      return res.status(400).json({ message: 'lot_id and slot_number required' });
    }

    const slotsPerRow = 4;
    const rowLetter = String.fromCharCode(65 + Math.floor((slot_number - 1) / slotsPerRow));
    const position = ((slot_number - 1) % slotsPerRow) + 1;
    const label = `${rowLetter}${position}`;

    const slot = await slotModel.createSlot({
      lot_id,
      slot_number,
      label,
      status: 'available'
    });
    await parkingLotModel.updateSlotCount(lot_id, 1);

    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add slot' });
  }
}

// Update slot status
async function updateSlot(req, res) {
  try {
    const { slotId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status required' });

    const updated = await slotModel.updateSlotStatus(slotId, status);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update slot' });
  }
}

// View all reservations
async function viewReservations(req, res) {
  try {
    const reservations = await reservationModel.getAllReservations();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch reservations' });
  }
}

// View all users
async function viewUsers(req, res) {
  try {
    const users = await userModel.getUsersByRole('user');
    const safe = users.map(u => {
      delete u.password;
      return u;
    });
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch users' });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const user = await userModel.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin accounts' });

    await userModel.deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}

// Remove a parking lot and all related slots/reservations
async function removeParkingLot(req, res) {
  try {
    const { lotId } = req.params;
    if (!lotId) return res.status(400).json({ message: 'lotId required' });

    const lot = await parkingLotModel.getParkingLotById(lotId);
    if (!lot) return res.status(404).json({ message: 'Parking lot not found' });

    const slots = await slotModel.getSlotsByLot(lotId);
    const allReservations = await reservationModel.getAllReservations();
    const slotIds = slots.map(s => s.slot_id);
    const relatedReservations = allReservations.filter(r => slotIds.includes(r.slot_id));

    for (const reservation of relatedReservations) {
      await reservationModel.cancelReservation(reservation.reservation_id);
    }

    for (const slot of slots) {
      await slotModel.deleteSlot(slot.slot_id);
    }

    await parkingLotModel.deleteParkingLot(lotId);

    res.json({ message: 'Parking lot and all related data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove parking lot' });
  }
}

module.exports = {
  login,
  dashboardStats,
  addParkingLot,
  addSlot,
  updateSlot,
  viewReservations,
  viewUsers,
  deleteUser,
  removeParkingLot,
};