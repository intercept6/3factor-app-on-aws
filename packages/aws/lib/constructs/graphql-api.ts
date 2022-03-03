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
      typeName: 'Mutation',
      fieldName: 'createOrder',
      requestMappingTemplate: MappingTemplate.fromString(`
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key" : {
    "orderId" : $util.dynamodb.toDynamoDBJson($util.autoId())
  },
  "attributeValues": $util.dynamodb.toMapValuesJson({
    "orderId": $ctx.args.input.orderId,
    "userId": $ctx.args.input.userId,
    "address": $ctx.args.input.address,
    "menuItems": $ctx.args.input.menuItems,
    "orderValid": false,
    "paymentValid": false,
    "restaurantApproved": false,
    "driverAssigned": false,
    "createdAt": $util.time.nowISO8601()
  })
}`),
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
