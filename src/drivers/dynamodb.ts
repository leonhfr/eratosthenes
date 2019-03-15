// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:dynamodb');

export class DynamoDB {
  static client = new AWS.DynamoDB.DocumentClient();

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async get<T>(
    input: AWS.DynamoDB.DocumentClient.GetItemInput
  ): Promise<T> {
    debugVerbose(`get input: %j`, input);
    const response = await this.client.get(input).promise();
    debugVerbose(`get response: %j`, response);
    return response.Item as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async put<T>(
    input: AWS.DynamoDB.DocumentClient.PutItemInput
  ): Promise<T> {
    debugVerbose(`put input: %j`, input);
    const response = await this.client.put(input).promise();
    debugVerbose(`put response: %j`, response);
    return input.Item as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async update<T>(
    input: AWS.DynamoDB.DocumentClient.UpdateItemInput
  ): Promise<T> {
    debugVerbose(`update input: %j`, input);
    const response = await this.client.update(input).promise();
    debugVerbose(`update response: %j`, response);
    return response.Attributes as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async delete<T>(
    input: AWS.DynamoDB.DocumentClient.DeleteItemInput
  ): Promise<T> {
    debugVerbose(`delete input: %j`, input);
    const response = await this.client.delete(input).promise();
    debugVerbose(`delete response: %j`, response);
    return input.Key as T;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async scan<T>(
    input: AWS.DynamoDB.DocumentClient.ScanInput
  ): Promise<MultipleItemsOutput<T>> {
    debugVerbose(`scan input: %j`, input);
    const response: AWS.DynamoDB.DocumentClient.ScanOutput = await this.client
      .scan(input)
      .promise();
    debugVerbose(`scan response: %j`, response);
    return response as MultipleItemsOutput<T>;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async query<T>(
    input: AWS.DynamoDB.DocumentClient.QueryInput
  ): Promise<MultipleItemsOutput<T>> {
    debugVerbose(`query input: %j`, input);
    const response: AWS.DynamoDB.DocumentClient.QueryOutput = await this.client
      .query(input)
      .promise();
    debugVerbose(`query response: %j`, response);
    return response as MultipleItemsOutput<T>;
  }
}

// Definition.
type MultipleItemsOutput<T> = {
  Items?: Array<T>;
  Count?: number;
  ScannedCount?: number;
  LastEvaluatedKey?: AWS.DynamoDB.DocumentClient.Key;
};
