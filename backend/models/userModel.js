const dynamoDb = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

const USERS_TABLE = process.env.USERS_TABLE || 'Users';

/**
 * Creates a new user record in DynamoDB
 * @param {{name:string,email:string,password:string,role:string}} user
 */
async function createUser(user) {
  const userItem = {
    user_id: uuidv4(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: user.password, // assumed already hashed
    role: user.role || 'user',
  };

  const params = {
    TableName: USERS_TABLE,
    Item: userItem,
    // ensure email uniqueness
    ConditionExpression: 'attribute_not_exists(email)',
  };

  await dynamoDb.put(params).promise();
  return userItem;
}

async function getUserByEmail(email) {
  const params = {
    TableName: USERS_TABLE,
    IndexName: 'email-index', // assume a GSI exists
    KeyConditionExpression: 'email = :e',
    ExpressionAttributeValues: {
      ':e': email,
    },
  };

  const result = await dynamoDb.query(params).promise();
  return result.Items && result.Items.length ? result.Items[0] : null;
}

async function getUserById(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { user_id: userId },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item;
}

async function getAllUsers() {
  const params = {
    TableName: USERS_TABLE,
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
}

async function getUsersByRole(role) {
  // uses a scan with a filter expression; DynamoDB will read all items but only return matches
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: '#r = :r',
    ExpressionAttributeNames: { '#r': 'role' },
    ExpressionAttributeValues: { ':r': role },
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
}

async function updateUser(userId, updates) {
  // updates may contain name and/or phone
  const expressionParts = [];
  const attrValues = {};
  const attrNames = {};

  if (updates.name !== undefined) {
    expressionParts.push('#n = :n');
    attrNames['#n'] = 'name';
    attrValues[':n'] = updates.name;
  }
  if (updates.phone !== undefined) {
    expressionParts.push('phone = :p');
    attrValues[':p'] = updates.phone;
  }

  if (expressionParts.length === 0) {
    // nothing to update
    return getUserById(userId);
  }

  const params = {
    TableName: USERS_TABLE,
    Key: { user_id: userId },
    UpdateExpression: 'SET ' + expressionParts.join(', '),
    ExpressionAttributeNames: Object.keys(attrNames).length ? attrNames : undefined,
    ExpressionAttributeValues: attrValues,
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
}

async function deleteUser(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { user_id: userId },
  };
  await dynamoDb.delete(params).promise();
  return { message: 'User deleted' };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  getUsersByRole,
  updateUser,
  deleteUser,
};