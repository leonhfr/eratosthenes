// Packages.
import * as AWS from 'aws-sdk';

// Instanciation.
export const DynamoDB = new AWS.DynamoDB.DocumentClient();
export const Lambda = new AWS.Lambda();
export const S3 = new AWS.S3();
export const Sqs = new AWS.SQS();
