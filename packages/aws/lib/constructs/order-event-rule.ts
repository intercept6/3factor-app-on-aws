import {Duration} from 'aws-cdk-lib';
import {IEventBus, Rule} from 'aws-cdk-lib/aws-events';
import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import {Tracing} from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';

interface OrderEventRuleProps {
  orderEventBus: IEventBus;
  graphqlApiUrl: string;
  graphqlApiKey: string;
}

export class OrderEventRule extends Construct {
  public readonly orderEventRule: Rule;

  constructor(
    scope: Construct,
    id: string,
    {orderEventBus, graphqlApiKey, graphqlApiUrl}: OrderEventRuleProps
  ) {
    super(scope, id);

    const commonFunctionProps: Partial<NodejsFunctionProps> = {
      tracing: Tracing.ACTIVE,
      timeout: Duration.seconds(30),
      environment: {
        GRAPHQL_API_URL: graphqlApiUrl,
        GRAPHQL_API_KEY: graphqlApiKey,
      },
    };

    new Rule(this, 'CreateOrderEvent', {
      eventBus: orderEventBus,
      eventPattern: {
        detail: {orderValid: [false]},
      },
    }).addTarget(
      new LambdaFunction(
        new NodejsFunction(this, 'OrderCreatedHandler', {
          entry: 'src/lambda/order-created-handler.ts',
          ...commonFunctionProps,
        })
      )
    );

    new Rule(this, 'OrderValidatedEvent', {
      eventBus: orderEventBus,
      eventPattern: {
        detail: {orderValid: [true]},
      },
    }).addTarget(
      new LambdaFunction(
        new NodejsFunction(this, 'PaymentHandler', {
          entry: 'src/lambda/payment-handler.ts',
          ...commonFunctionProps,
        })
      )
    );

    new Rule(this, 'PaymentValidatedEvent', {
      eventBus: orderEventBus,
      eventPattern: {
        detail: {paymentValid: [true]},
      },
    }).addTarget(
      new LambdaFunction(
        new NodejsFunction(this, 'RestaurantHandler', {
          entry: 'src/lambda/restaurant-handler.ts',
          ...commonFunctionProps,
        })
      )
    );

    new Rule(this, 'RestaurantApprovedEvent', {
      eventBus: orderEventBus,
      eventPattern: {
        detail: {restaurantApproved: [true]},
      },
    }).addTarget(
      new LambdaFunction(
        new NodejsFunction(this, 'DriverHandler', {
          entry: 'src/lambda/driver-handler.ts',
          ...commonFunctionProps,
        })
      )
    );
  }
}
