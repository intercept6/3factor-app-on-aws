import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type CreateOrderInput = {
  address: Scalars['String'];
  menuItems: Array<Scalars['String']>;
  userId: Scalars['String'];
};

export type Mutation = {
  createOrder: Order;
  updateOrder: Order;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderInput;
};

export type Order = {
  address: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  driverAssigned: Scalars['Boolean'];
  menuItems: Array<Scalars['String']>;
  orderId: Scalars['ID'];
  orderValid: Scalars['Boolean'];
  paymentValid: Scalars['Boolean'];
  restaurantApproved: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type Query = {
  getAllOrders: Array<Order>;
  getOrder?: Maybe<Order>;
};


export type QueryGetOrderArgs = {
  orderId: Scalars['ID'];
};

export type Subscription = {
  onOrderUpdate?: Maybe<Order>;
};


export type SubscriptionOnOrderUpdateArgs = {
  orderId: Scalars['ID'];
};

export type UpdateOrderInput = {
  driverAssigned?: InputMaybe<Scalars['Boolean']>;
  orderId: Scalars['ID'];
  orderValid?: InputMaybe<Scalars['Boolean']>;
  paymentValid?: InputMaybe<Scalars['Boolean']>;
  restaurantApproved?: InputMaybe<Scalars['Boolean']>;
};

export type CreateOrderMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateOrderMutation = { createOrder: { orderId: string } };

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type GetOrderQuery = { getOrder?: { orderId: string, userId: string, address: string, menuItems: Array<string>, orderValid: boolean, paymentValid: boolean, restaurantApproved: boolean, driverAssigned: boolean, createdAt: string } | null };

export type GetAllOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOrdersQuery = { getAllOrders: Array<{ orderId: string, userId: string, address: string, menuItems: Array<string>, orderValid: boolean, paymentValid: boolean, restaurantApproved: boolean, driverAssigned: boolean, createdAt: string }> };

export type OnOrderUpdateSubscriptionVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type OnOrderUpdateSubscription = { onOrderUpdate?: { orderId: string, userId: string, address: string, menuItems: Array<string>, orderValid: boolean, paymentValid: boolean, restaurantApproved: boolean, driverAssigned: boolean, createdAt: string } | null };


export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"Taro","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"StringValue","value":"Tokyo","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"menuItems"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Breads","block":false},{"kind":"StringValue","value":"Sauces","block":false},{"kind":"StringValue","value":"Toppings","block":false}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const GetOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"menuItems"}},{"kind":"Field","name":{"kind":"Name","value":"orderValid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentValid"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantApproved"}},{"kind":"Field","name":{"kind":"Name","value":"driverAssigned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetOrderQuery, GetOrderQueryVariables>;
export const GetAllOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"menuItems"}},{"kind":"Field","name":{"kind":"Name","value":"orderValid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentValid"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantApproved"}},{"kind":"Field","name":{"kind":"Name","value":"driverAssigned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAllOrdersQuery, GetAllOrdersQueryVariables>;
export const OnOrderUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onOrderUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onOrderUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"menuItems"}},{"kind":"Field","name":{"kind":"Name","value":"orderValid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentValid"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantApproved"}},{"kind":"Field","name":{"kind":"Name","value":"driverAssigned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<OnOrderUpdateSubscription, OnOrderUpdateSubscriptionVariables>;