const reservationModel = require('../models/reservationModel');
const slotModel = require('../models/slotModel');
const parkingLotModel = require('../models/parkingLotModel');

// pricing helper
function calculatePrice(vehicleType) {
  switch (vehicleType) {
    case 'car':
      return 50;
    case 'bike':
      return 20;
    case 'electric':
      return 40;
    default:
      return 50;
  }
}

async function bookSlot(req, res) {
  try {
    const { slot_id, vehicle_type, vehicle_number, start_time, end_time } = req.body;
    const user_id = req.user.user_id;

    if (!slot_id || !vehicle_type || !vehicle_number || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // check if slot exists and is available
    const slot = await slotModel.getSlotById(slot_id);
    if (!slot || slot.status !== 'available') {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // change slot status to reserved
    await slotModel.updateSlotStatus(slot_id, 'reserved');
    // decrement available count
    await parkingLotModel.updateSlotCount(slot.lot_id, -1);

    const price = calculatePrice(vehicle_type);
    const reservation = await reservationModel.createReservation({
      user_id,
      slot_id,
      vehicle_type,
      vehicle_number,
      start_time,
      end_time,
      price,
    });

    // emit socket update for UI
    try {
      const { getIo } = require('../socket');
      const io = getIo();
      io.emit('slotStatusUpdated', { slot_id, status: 'reserved', lot_id: slot.lot_id });
    } catch (e) {
      // ignore if socket not ready
    }

    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to book slot' });
  }
}

async function getUserReservations(req, res) {
  try {
    const { userId } = req.params;
    // authorize user to see own.
    if (req.user.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const reservations = await reservationModel.getReservationsByUser(userId);
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch reservations' });
  }
}

async function cancelReservation(req, res) {
  try {
    const { reservationId } = req.params;

    // fetch the reservation to restore slot/lot
    const all = await reservationModel.getAllReservations();
    const reservation = all.find(r => r.reservation_id === reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (req.user.user_id !== reservation.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // mark cancelled
    await reservationModel.cancelReservation(reservationId);
    // restore slot status and lot count
    await slotModel.updateSlotStatus(reservation.slot_id, 'available');
    // get slot to know lot
    const slot = await slotModel.getSlotById(reservation.slot_id);
    if (slot) {
      await parkingLotModel.updateSlotCount(slot.lot_id, 1);
      try {
        const { getIo } = require('../socket');
        const io = getIo();
        io.emit('slotStatusUpdated', { slot_id: reservation.slot_id, status: 'available', lot_id: slot.lot_id });
      } catch {}
    }

    res.json({ message: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel' });
  }
}

// return available slots for a lot (only those with status 'available')
async function getAvailableSlots(req, res) {
  try {
    const { lot_id } = req.params;
    const slots = await slotModel.getAvailableSlots(lot_id);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch available slots' });
  }
}

async function extendReservation(req, res) {
  try {
    const { reservationId } = req.params;
    const { new_end_time } = req.body;
    if (!new_end_time) {
      return res.status(400).json({ message: 'new_end_time required' });
    }

    // optional: verify reservation belongs to user
    const all = await reservationModel.getAllReservations();
    const reservation = all.find(r => r.reservation_id === reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (req.user.user_id !== reservation.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this reservation' });
    }

    const updated = await reservationModel.extendReservation(reservationId, new_end_time);
    res.json({ message: 'Reservation extended', reservation: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to extend reservation' });
  }
}

module.exports = {
  bookSlot,
  getUserReservations,
  cancelReservation,
};