import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  MappingTemplate,
  Schema,
} from '@aws-cdk/aws-appsync-alpha';
import {Duration, Expiration} from 'aws-cdk-lib';
import {ITable} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';
import {resolve} from 'path';

interface WebApiProps {
  orderTable: ITable;
}

export class WebApi extends Construct {
  public readonly api: GraphqlApi;

  constructor(scope: Construct, id: string, props: WebApiProps) {
    super(scope, id);

    const api = new GraphqlApi(this, 'API', {
      name: '3FactorAppOnAws',
      schema: Schema.fromAsset(
        resolve(__dirname, '../../../../schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {expires: Expiration.after(Duration.days(30))},
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
    });
    this.api = api;

    const orderDS = api.addDynamoDbDataSource(
      'OrderDataSource',
      props.orderTable
    );

    orderDS.createResolver({
      typeName: 'Query',
      fieldName: 'getOrder',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem(
        'orderId',
        'orderId'
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    orderDS.createResolver({
      typeName: 'Query',
      fieldName: 'getAllOrders',
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    orderDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createOrder',
      requestMappingTemplate: MappingTemplate.fromFile(
        resolve(__dirname, '../../src/vtl/create-order.vtl')
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    orderDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateOrder',
      requestMappingTemplate: MappingTemplate.fromFile(
        resolve(__dirname, '../../src/vtl/update-order.vtl')
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }
}
