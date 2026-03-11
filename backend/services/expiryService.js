const reservationModel = require('../models/reservationModel');
const slotModel = require('../models/slotModel');
const parkingLotModel = require('../models/parkingLotModel');

async function checkExpirations() {
  try {
    const now = new Date().toISOString();
    const all = await reservationModel.getAllReservations();
    const expired = all.filter(
      (r) => r.status === 'active' && r.end_time && r.end_time < now
    );
    if (expired.length === 0) return;

    console.log(`Found ${expired.length} expired reservations, updating...`);
    for (const r of expired) {
      // mark reservation completed
      await reservationModel.updateStatus(r.reservation_id, 'completed');

      // free the slot
      const slot = await slotModel.getSlotById(r.slot_id);
      if (slot) {
        await slotModel.updateSlotStatus(r.slot_id, 'available');
        // also bump lot's available count if we track it
        if (slot.lot_id) {
          await parkingLotModel.updateSlotCount(slot.lot_id, 1);
        }
        try {
          const { getIo } = require('../socket');
          const io = getIo();
          io.emit('slotStatusUpdated', { slot_id: r.slot_id, status: 'available', lot_id: slot.lot_id });
        } catch (e) {
          // ignore socket issues
        }
      }
    }
  } catch (err) {
    console.error('Error during expiration check', err);
  }
}

function startWatcher(intervalMs = 60_000) {
  // run immediately then schedule
  checkExpirations();
  setInterval(checkExpirations, intervalMs);
}

module.exports = {
  checkExpirations,
  startWatcher,
};
