const slotModel = require('../models/slotModel');
const parkingLotModel = require('../models/parkingLotModel');

// Returns the live status of every slot in a lot
async function getLiveSlots(req, res) {
  try {
    const { lotId } = req.params;
    console.log('Fetching slots for lotId:', lotId);

    // Optional: check if lot exists first
    const lot = await parkingLotModel.getParkingLotById(lotId);
    if (!lot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    let slots = await slotModel.getSlotsByLot(lotId);

    // If no slots exist, generate default row-based slots
    if (!slots || slots.length === 0) {
      const total = Number(lot.total_slots) || 0;
      const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const slotsPerRow = 4;
      const generatedSlots = [];

      for (let i = 0; i < total; i++) {
        const rowLetter = rows[Math.floor(i / slotsPerRow)];
        const position = (i % slotsPerRow) + 1;
        generatedSlots.push({
          slot_number: i + 1,
          label: `${rowLetter}${position}`,
          status: 'available',
          lot_id: lotId,
        });
      }

      // Optional: save these slots to DB if needed
      // slots = await Promise.all(generatedSlots.map(s => slotModel.createSlot(s)));
      slots = generatedSlots;
    }

    // Simplify output
    const simplified = slots.map(s => ({
      slot_id: s.slot_id,
      slot_number: s.slot_number,
      status: s.status,
      label: s.label,  // include label for frontend
    }));

    res.json(simplified);
  } catch (err) {
    console.error('Error in getLiveSlots:', err);
    res.status(500).json({ message: 'Unable to fetch live slot data' });
  }
}

module.exports = {
  getLiveSlots,
};