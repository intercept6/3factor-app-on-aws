import { useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CreateOrderDocument } from '../src/graphql/generated';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { push } = useRouter();

  const [mutateFunction, { data }] = useMutation(CreateOrderDocument);

  const handleOrder = async () => {
    await mutateFunction();
  };

  useEffect(() => {
    if (data?.createOrder.orderId != null) {
      push(`/orders/${data?.createOrder.orderId}`);
    }
  }, [push, data]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <button onClick={handleOrder}>Order</button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
