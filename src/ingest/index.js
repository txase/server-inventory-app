const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async message => {
  await lambda.invoke({
    FunctionName: process.env.FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(message)
  }).promise();
};

