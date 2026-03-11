const dynamoDb = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

const PARKING_LOTS_TABLE = process.env.PARKING_LOTS_TABLE || 'ParkingLots';

async function createParkingLot(lot) {
  // ensure numeric values for slot counts
  const total = Number(lot.total_slots) || 0;
  const available = Number(lot.available_slots) || total;

  const item = {
    lot_id: uuidv4(),
    name: lot.name || '',
    location: lot.location,
    city: lot.city,
    total_slots: total,
    available_slots: available,
  };
  const params = {
    TableName: PARKING_LOTS_TABLE,
    Item: item,
  };
  await dynamoDb.put(params).promise();
  return item;
}

async function getAllParkingLots() {
  const params = {
    TableName: PARKING_LOTS_TABLE,
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
}

async function getParkingLotById(lotId) {
  const params = {
    TableName: PARKING_LOTS_TABLE,
    Key: { lot_id: lotId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
}

async function updateSlotCount(lotId, availableSlotsDiff) {
  const params = {
    TableName: PARKING_LOTS_TABLE,
    Key: { lot_id: lotId },
    UpdateExpression: 'SET available_slots = available_slots + :diff',
    ExpressionAttributeValues: {
      ':diff': availableSlotsDiff,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
}

async function deleteParkingLot(lotId) {
  const params = {
    TableName: PARKING_LOTS_TABLE,
    Key: { lot_id: lotId },
  };
  await dynamoDb.delete(params).promise();
  return { message: 'Parking lot deleted' };
}

module.exports = {
  createParkingLot,
  getAllParkingLots,
  getParkingLotById,
  updateSlotCount,
  deleteParkingLot,
};