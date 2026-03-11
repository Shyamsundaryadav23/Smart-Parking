const dynamoDb = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

const SLOTS_TABLE = process.env.SLOTS_TABLE || 'ParkingSlots';

async function createSlot(slot) {
  const item = {
    slot_id: uuidv4(),
    lot_id: slot.lot_id,
    slot_number: slot.slot_number,
    label: slot.label || `S${slot.slot_number}`, // row-based label
    status: slot.status || 'available',
  };
  const params = {
    TableName: SLOTS_TABLE,
    Item: item,
  };
  await dynamoDb.put(params).promise();
  return item;
}

async function getSlotsByLot(lotId) {
  const params = {
    TableName: SLOTS_TABLE,
    IndexName: 'lot-index', // assume GSI on lot_id
    KeyConditionExpression: 'lot_id = :l',
    ExpressionAttributeValues: {
      ':l': lotId,
    },
  };
  const result = await dynamoDb.query(params).promise();
  return result.Items;
}

async function getSlotById(slotId) {
  const params = {
    TableName: SLOTS_TABLE,
    Key: { slot_id: slotId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
}

async function updateSlotStatus(slotId, status) {
  const params = {
    TableName: SLOTS_TABLE,
    Key: { slot_id: slotId },
    UpdateExpression: 'SET #s = :st',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':st': status },
    ReturnValues: 'UPDATED_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  const attrs = result.Attributes;

  // emit socket.io event if available
  try {
    const { getIo } = require('../socket');
    const io = getIo();

    // fetch slot info to include lot_id and label
    let slot = null;
    try {
      slot = await getSlotById(slotId);
    } catch {}

    if (slot) {
      io.emit('slotStatusUpdated', {
        slot_id: slotId,
        status,
        lot_id: slot.lot_id,
        label: slot.label, // include label for frontend
      });
    }
  } catch (e) {
    // ignore if socket not initialized or module not found
    console.error("Socket emit failed:", e.message);
  }

  return attrs;
}

async function deleteSlot(slotId) {
  const params = {
    TableName: SLOTS_TABLE,
    Key: { slot_id: slotId },
  };
  await dynamoDb.delete(params).promise();
  return { message: 'Slot deleted' };
}

module.exports = {
  createSlot,
  getSlotsByLot,
  getSlotById,
  updateSlotStatus,
  deleteSlot,
};