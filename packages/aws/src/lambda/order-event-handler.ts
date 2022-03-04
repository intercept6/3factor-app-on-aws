import {DynamoDBStreamHandler} from 'aws-lambda';
import {unmarshall} from '@aws-sdk/util-dynamodb';
import {EventBridgeClient, PutEventsCommand} from '@aws-sdk/client-eventbridge';
import {captureAWSv3Client} from 'aws-xray-sdk';

const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

export const handler: DynamoDBStreamHandler = async event => {
  const details = event.Records.flatMap(({dynamodb}) =>
    dynamodb?.NewImage === undefined
      ? []
      : [unmarshall(dynamodb.NewImage as any)]
  ); // @types/aws-lambdaのAttributeValueと@aws-sdk/client-dynamoDBのAttributeValueの型定義がズレている模様

  const client = captureAWSv3Client(new EventBridgeClient({}));
  const entries = details.map(detail => ({
    EventBusName: EVENT_BUS_NAME,
    Source: 'order-event-handler',
    DetailType: 'order status changed',
    Detail: JSON.stringify(detail),
  }));

  if (entries.length < 1) {
    return;
  }

  await client.send(
    new PutEventsCommand({
      Entries: entries,
    })
  );
};
