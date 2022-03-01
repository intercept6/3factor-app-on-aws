import {EventBridgeHandler} from 'aws-lambda';
import {captureHTTPsGlobal, capturePromise} from 'aws-xray-sdk';
import axios from 'axios';
import {print} from 'graphql';
import gql from 'graphql-tag';
import http from 'http';
import https from 'https';
import {Detail, DetailType} from '../types/order-event';
import {timeout} from './lib/util';

const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL!;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY!;

captureHTTPsGlobal(http, true);
captureHTTPsGlobal(https, true);
capturePromise();

export const handler: EventBridgeHandler<
  DetailType,
  Detail,
  void
> = async event => {
  await timeout(3_000); // ドライバーをアサインする

  const UPDATE_ORDER = gql`
    mutation updateOrder($orderId: ID!) {
      updateOrder(input: {orderId: $orderId, driverAssigned: true}) {
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

  await axios({
    url: GRAPHQL_API_URL,
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-api-key': GRAPHQL_API_KEY,
    },
    data: {
      query: print(UPDATE_ORDER),
      variables: {
        orderId: event.detail.orderId,
      },
    },
  });
};
