// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyHandler, Handler } from "aws-lambda";
import { middyfy } from '@libs/lambda';
import { DynamoDB } from "aws-sdk";

// import schema from './schema';
const dynamoDB = new DynamoDB.DocumentClient();
type requestParams = {
  itemName: string;
  date: string;
};
const getErrorResponse = (errorMessage: string) => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: errorMessage,
    }),
  };
};
// const postTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `item name is ${event.body.itemName}, posted at ${event.body.date}`,
//     event,
//   });
// };
export const getAllTodo: APIGatewayProxyHandler = async (event, _context) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log(err);
    return getErrorResponse(err);
  }
};
export const updateTodo: APIGatewayProxyHandler = async (event, _context) => {
  const date=event.pathParameters.date

  const requestBody: requestParams = JSON.parse(event.body);
  const { itemName} = requestBody;
  console.log(
    `Brew Name: ${itemName}`
  );


  try {
    const params = {
      TableName: process.env.DYNAMO_TABLE,
      Item: {
        itemName,
        date:date
      },
    };
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (err) {
    console.error(err);
    return getErrorResponse(err);
  }
};
export const deleteTodo: APIGatewayProxyHandler = async (event, _context) => {
  const date=event.pathParameters.date
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key:{
      date:date
    }
  };

  try {
    const data = await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log(err);
    return getErrorResponse(err);
  }
};
export const getTodo: Handler = async (event, _context) => {
  const date=event.pathParameters.date
  console.log(date)
 
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key:{
      date:date
    }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    console.log(data)
    if(!data){
      return{
        statusCode:404,
        body:JSON.stringify({error:"not found"})
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.log(err);
    return getErrorResponse(err);
  }
};
export const postTodo: APIGatewayProxyHandler = async (event, _context) => {
  const requestBody: requestParams = JSON.parse(event.body);
  const { itemName,date } = requestBody;
  console.log(
    `Brew Name: ${itemName}, Brewery: ${date}`
  );


  try {
    const params = {
      TableName: process.env.DYNAMO_TABLE,
      Item: {
        itemName,
        date
      },
    };
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (err) {
    console.error(err);
    return getErrorResponse(err);
  }
};
export const main = middyfy(postTodo);
