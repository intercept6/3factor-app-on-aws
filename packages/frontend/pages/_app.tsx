import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthOptions, AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const url = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;
// const wsUrl = process.env.NEXT_PUBLIC_GRAPHQL_REALTIME_API_URL!;
const region = 'ap-northeast-1';
const auth: AuthOptions = {
  type: AUTH_TYPE.API_KEY,
  apiKey: process.env.NEXT_PUBLIC_GRAPHQL_API_KEY!,
};

const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
