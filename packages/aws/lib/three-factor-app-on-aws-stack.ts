import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {AttributeType, StreamViewType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';
import {OrderEventBus} from './constructs/order-event-bus';
import {OrderEventRule} from './constructs/order-event-rule';
import {WebApi} from './constructs/graphql-api';

export class ThreeFactorAppOnAwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const orderTable = new Table(this, 'OrderTable', {
      partitionKey: {
        name: 'orderId',
        type: AttributeType.STRING,
      },
      readCapacity: 1,
      writeCapacity: 1,
      stream: StreamViewType.NEW_IMAGE,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const {api} = new WebApi(this, 'WebApi', {
      orderTable,
    });
    new CfnOutput(this, 'GraphqlApiUrl', {value: api.graphqlUrl});

    const {orderEventBus} = new OrderEventBus(this, 'OrderEventBus', {
      orderTable,
    });

    new OrderEventRule(this, 'OrderEventRule', {
      orderEventBus,
      graphqlApiUrl: api.graphqlUrl,
      graphqlApiKey: api.apiKey!,
    });
  }
}
