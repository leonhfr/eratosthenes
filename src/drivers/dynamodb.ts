// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:dynamodb');

const client = new AWS.DynamoDB.DocumentClient();

export class DynamoDB {
  // ignoring wrapping function
  /*istanbul ignore next*/
  static async get<T>(
    input: AWS.DynamoDB.DocumentClient.GetItemInput
  ): Promise<T> {
    debugVerbose(`get input: %j`, input);
    const response = await client.get(input).promise();
    debugVerbose(`get response: %j`, response);
    return response.Item as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async put<T>(
    input: AWS.DynamoDB.DocumentClient.PutItemInput
  ): Promise<T> {
    debugVerbose(`put input: %j`, input);
    const response = await client.put(input).promise();
    debugVerbose(`put response: %j`, response);
    return input.Item as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async update<T>(
    input: AWS.DynamoDB.DocumentClient.UpdateItemInput
  ): Promise<T> {
    debugVerbose(`update input: %j`, input);
    const response = await client.update(input).promise();
    debugVerbose(`update response: %j`, response);
    return response.Attributes as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async delete<T>(
    input: AWS.DynamoDB.DocumentClient.DeleteItemInput
  ): Promise<T> {
    debugVerbose(`delete input: %j`, input);
    const response = await client.delete(input).promise();
    debugVerbose(`delete response: %j`, response);
    return input.Key as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async scan<T>(
    input: AWS.DynamoDB.DocumentClient.ScanInput
  ): Promise<T> {
    debugVerbose(`scan input: %j`, input);
    const response: AWS.DynamoDB.DocumentClient.ScanOutput = await client
      .scan(input)
      .promise();
    debugVerbose(`scan response: %j`, response);
    return response as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async query<T>(
    input: AWS.DynamoDB.DocumentClient.QueryInput
  ): Promise<T> {
    debugVerbose(`query input: %j`, input);
    const response: AWS.DynamoDB.DocumentClient.QueryOutput = await client
      .query(input)
      .promise();
    debugVerbose(`query response: %j`, response);
    return response as T;
  }
}
