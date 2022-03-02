import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
  fetchOptions: {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_GRAPHQL_API_KEY!,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
