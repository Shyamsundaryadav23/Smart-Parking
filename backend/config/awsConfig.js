// const AWS = require('aws-sdk');

// dotenv = require('dotenv');
// dotenv.config();

// // Configure AWS SDK with region and credentials from environment variables
// AWS.config.update({
//   region: process.env.AWS_REGION || 'us-east-1',
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.exports = dynamoDb;
const AWS = require("aws-sdk");
require("dotenv").config();

console.log("AWS REGION:", process.env.AWS_REGION);
console.log("Users Table:", process.env.USERS_TABLE);

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;