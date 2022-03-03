import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  GetOrderDocument,
  OnOrderUpdateDocument,
  Order,
} from '../../src/graphql/generated';
import { usePatchedSubscription } from '../../src/hooks/usePatchedSubscription';
import styles from '../../styles/Order.module.css';

const Status = ({ context, status }: { context: string; status: boolean }) => {
  return (
    <li>
      {status ? '✅' : '❌'} -{' '}
      <p style={{ display: 'inline', color: status ? 'green' : undefined }}>
        {context}
      </p>
    </li>
  );
};

const Order = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.id === 'string') {
        setOrderId(router.query.id);
      }
    }
  }, [router]);

  const { data: initData } = useQuery(GetOrderDocument, {
    variables: { orderId },
  });
  const { data: subscData } = usePatchedSubscription(OnOrderUpdateDocument, {
    variables: { orderId },
  });

  const [orderData, setOrderData] = useState<Order | null>(null);
  useEffect(() => {
    if (initData?.getOrder != null) {
      const prev = initData.getOrder;
      const current = subscData?.onOrderUpdate;

      setOrderData({
        ...prev,
        orderValid: current?.orderValid
          ? current?.orderValid
          : prev?.orderValid,
        paymentValid: current?.paymentValid
          ? current?.paymentValid
          : prev?.paymentValid,
        restaurantApproved: current?.restaurantApproved
          ? current?.restaurantApproved
          : prev?.restaurantApproved,
        driverAssigned: current?.driverAssigned
          ? current?.driverAssigned
          : prev?.driverAssigned,
      });
    }
  }, [initData, subscData]);

  if (orderData == null) {
    return <div>No order found</div>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>Created: </td>
              <td>
                {new Intl.DateTimeFormat('ja-Jp', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(orderData.createdAt))}
              </td>
            </tr>
            <tr>
              <td>id: </td>
              <td>{orderData.orderId}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <ul>
                  <Status
                    context="Order validation"
                    status={orderData.orderValid}
                  />
                  <Status
                    context="Your payment"
                    status={orderData.paymentValid}
                  />
                  <Status
                    context="Restaurant approval"
                    status={orderData.restaurantApproved}
                  />
                  <Status
                    context="Driver assignment"
                    status={orderData.driverAssigned}
                  />
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => {
            router.push('/');
          }}
        >
          Cancel
        </button>
      </main>
    </div>
  );
};

export default Order;
