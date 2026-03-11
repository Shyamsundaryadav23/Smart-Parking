const parkingLotModel = require('../models/parkingLotModel');
const slotModel = require('../models/slotModel');

async function listParkingLots(req, res) {
  try {
    const lots = await parkingLotModel.getAllParkingLots();
    res.json(lots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch parking lots' });
  }
}

// Helper function
function generateRowSlots(totalSlots) {
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const slots = [];
  const slotsPerRow = 4; // Adjust number of columns per row

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

async function listSlots(req, res) {
  try {
    const { lotId } = req.params;
    let slots = await slotModel.getSlotsByLot(lotId);

    if (slots.length === 0) {
      const lot = await parkingLotModel.getParkingLotById(lotId);
      if (lot && Number(lot.total_slots) > 0) {
        const total = Number(lot.total_slots);
        const generatedSlots = generateRowSlots(total);
        const createPromises = generatedSlots.map(slot =>
          slotModel.createSlot({
            lot_id: lotId,
            slot_number: slot.slot_number,
            label: slot.label
          })
        );
        slots = await Promise.all(createPromises);
      }
    }

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch slots' });
  }
}

module.exports = {
  listParkingLots,
  listSlots,
  generateRowSlots
};