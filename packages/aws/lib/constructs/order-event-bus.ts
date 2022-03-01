import {ITable} from 'aws-cdk-lib/aws-dynamodb';
import {EventBus} from 'aws-cdk-lib/aws-events';
import {StartingPosition, Tracing} from 'aws-cdk-lib/aws-lambda';
import {DynamoEventSource} from 'aws-cdk-lib/aws-lambda-event-sources';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';

interface OrderEventBusProps {
  orderTable: ITable;
}

export class OrderEventBus extends Construct {
  public readonly orderEventBus: EventBus;

  constructor(scope: Construct, id: string, props: OrderEventBusProps) {
    super(scope, id);

    const orderEventBus = new EventBus(this, 'OrderEventBus');
    this.orderEventBus = orderEventBus;

    const orderEventHandler = new NodejsFunction(this, 'OrderEventHandler', {
      entry: 'src/lambda/order-event-handler.ts',
      tracing: Tracing.ACTIVE,
      environment: {
        EVENT_BUS_NAME: orderEventBus.eventBusName,
      },
    });
    orderEventHandler.addEventSource(
      new DynamoEventSource(props.orderTable, {
        startingPosition: StartingPosition.LATEST,
      })
    );
    orderEventBus.grantPutEventsTo(orderEventHandler);
  }
}
