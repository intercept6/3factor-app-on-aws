import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateOrderInput = {
  address: Scalars['String'];
  menuItems: Array<Scalars['String']>;
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
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
  __typename?: 'Order';
  address: Scalars['String'];
  driverAssigned: Scalars['Boolean'];
  menuItems: Array<Scalars['String']>;
  orderId: Scalars['ID'];
  orderValid: Scalars['Boolean'];
  paymentValid: Scalars['Boolean'];
  restaurantApproved: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getOrder?: Maybe<Order>;
};


export type QueryGetOrderArgs = {
  orderId: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
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

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type GetOrderQuery = { __typename?: 'Query', getOrder?: { __typename?: 'Order', orderId: string, userId: string, address: string, menuItems: Array<string>, orderValid: boolean, paymentValid: boolean, restaurantApproved: boolean, driverAssigned: boolean } | null };

export type OnOrderUpdateSubscriptionVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type OnOrderUpdateSubscription = { __typename?: 'Subscription', onOrderUpdate?: { __typename?: 'Order', orderId: string, userId: string, address: string, menuItems: Array<string>, orderValid: boolean, paymentValid: boolean, restaurantApproved: boolean, driverAssigned: boolean } | null };


export const GetOrderDocument = gql`
    query GetOrder($orderId: ID!) {
  getOrder(orderId: $orderId) {
    orderId
    userId
    address
    menuItems
    orderValid
    paymentValid
    restaurantApproved
    driverAssigned
  }
}
    `;

export function useGetOrderQuery(options: Omit<Urql.UseQueryArgs<GetOrderQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOrderQuery>({ query: GetOrderDocument, ...options });
};
export const OnOrderUpdateDocument = gql`
    subscription onOrderUpdate($orderId: ID!) {
  onOrderUpdate(orderId: $orderId) {
    orderId
    userId
    address
    menuItems
    orderValid
    paymentValid
    restaurantApproved
    driverAssigned
  }
}
    `;

export function useOnOrderUpdateSubscription<TData = OnOrderUpdateSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnOrderUpdateSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnOrderUpdateSubscription, TData>) {
  return Urql.useSubscription<OnOrderUpdateSubscription, TData, OnOrderUpdateSubscriptionVariables>({ query: OnOrderUpdateDocument, ...options }, handler);
};