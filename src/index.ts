export * from './drivers';

import { DynamoDbDriver, LambdaDriver, S3Driver, SqsDriver } from './drivers';

export namespace Erathostenes {
  export const Dynamo = DynamoDbDriver;
  export const Lambda = LambdaDriver;
  export const S3 = S3Driver;
  export const Sqs = SqsDriver;
}
