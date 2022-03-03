import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {AttributeType, StreamViewType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';
import {OrderEventBus} from './constructs/order-event-bus';
import {OrderEventRule} from './constructs/order-event-rule';
import {WebApi} from './constructs/graphql-api';
import {Bucket} from 'aws-cdk-lib/aws-s3';
import {
  Distribution,
  Function,
  FunctionCode,
  FunctionEventType,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import {S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins';
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment';

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

    const websiteBucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const viewerRequestFn = new Function(this, 'ViewerRequestFunction', {
      code: FunctionCode.fromFile({
        filePath: 'src/cloudfront-function/viewer-request/redirect.js',
      }),
    });

    const distribution = new Distribution(this, 'Disribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(websiteBucket), // S3Originクラスを使うことでOAIも自動で設定されます。
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            eventType: FunctionEventType.VIEWER_REQUEST,
            function: viewerRequestFn,
          },
        ],
      },
      priceClass: PriceClass.PRICE_CLASS_200,
    });
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });

    new BucketDeployment(this, 'Deploy', {
      sources: [Source.asset('../frontend/out')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
