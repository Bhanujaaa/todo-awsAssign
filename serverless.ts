import type { AWS } from '@serverless/typescript';
const SERVICE_NAME = "todoAssign1-no-error";
const DYNAMO_TABLE = `${SERVICE_NAME}-AB-dev`;


const serverlessConfiguration: AWS = {
  service: SERVICE_NAME,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    stage:'dev', 
    region:'us-east-1', 
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DYNAMO_TABLE,
    },
    iam:{role:{statements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "*",
      }
    ]
  }}
  },
  // import the function via paths
  functions: {
    postTodo: {
      handler: "./src/functions/hello/handler.postTodo",
      events: [
        {
          http: {
            method: "post",
            path: "todoItems",
          },
        },
      ],
    },
    getTodo: {
      handler: "./src/functions/hello/handler.getTodo",
      events: [
        {
          http: {
            method: "get",
            path: "todoItems/{date}",
          },
        },
      ],
    },
    updateTodo: {
      handler: "./src/functions/hello/handler.updateTodo",
      events: [
        {
          http: {
            method: "put",
            path: "todoItems/{date}",
          },
        },
      ],
    },
    deleteTodo: {
      handler: "./src/functions/hello/handler.deleteTodo",
      events: [
        {
          http: {
            method: "delete",
            path: "todoItems/{date}",
          },
        },
      ],
    },
    getAllTodo: {
      handler: "./src/functions/hello/handler.getAllTodo",
      events: [
        {
          http: {
            method: "get",
            path: "todoAllItems",
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      TodoDynamoTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "date",
              AttributeType: "S",
            }
          ],
          KeySchema: [
            {
              AttributeName: "date",
              KeyType: "HASH",
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: DYNAMO_TABLE,
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
