const dynamoDb = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

const RESERVATIONS_TABLE = process.env.RESERVATIONS_TABLE || 'Reservations';

async function createReservation(reservation) {
  const item = {
    reservation_id: uuidv4(),
    user_id: reservation.user_id,
    slot_id: reservation.slot_id,
    vehicle_type: reservation.vehicle_type,
    vehicle_number: reservation.vehicle_number,
    start_time: reservation.start_time,
    end_time: reservation.end_time,
    price: reservation.price,
    status: reservation.status || 'active',
  };
  const params = {
    TableName: RESERVATIONS_TABLE,
    Item: item,
  };
  await dynamoDb.put(params).promise();
  return item;
}

async function getReservationsByUser(userId) {
  const params = {
    TableName: RESERVATIONS_TABLE,
    IndexName: 'user-index',
    KeyConditionExpression: 'user_id = :u',
    ExpressionAttributeValues: {
      ':u': userId,
    },
  };
  const result = await dynamoDb.query(params).promise();
  return result.Items;
}

async function getAllReservations() {
  const params = {
    TableName: RESERVATIONS_TABLE,
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
}

async function cancelReservation(reservationId) {
  // use generic updateStatus to mark cancelled
  return await updateStatus(reservationId, 'cancelled');
}

async function extendReservation(reservationId, newEndTime) {
  const params = {
    TableName: RESERVATIONS_TABLE,
    Key: { reservation_id: reservationId },
    UpdateExpression: 'SET end_time = :e',
    ExpressionAttributeValues: { ':e': newEndTime },
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
}

// generic helper to update status field
async function updateStatus(reservationId, status) {
  const params = {
    TableName: RESERVATIONS_TABLE,
    Key: { reservation_id: reservationId },
    UpdateExpression: 'SET #s = :st',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':st': status },
    ReturnValues: 'UPDATED_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
}

module.exports = {
  createReservation,
  getReservationsByUser,
  getAllReservations,
  cancelReservation,
  extendReservation,
  updateStatus,
};