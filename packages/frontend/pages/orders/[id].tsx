import { useRouter } from 'next/router';
import {
  useGetOrderQuery,
  useOnOrderUpdateSubscription,
} from '../../src/graphql/generated';
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
  const { id } = router.query;

  const handleCancel = () => {
    router.push('/');
  };

  const [] = useOnOrderUpdateSubscription({
    variables: { orderId: id as string },
  });

  const [{ data }] = useGetOrderQuery({
    variables: {
      orderId: id as string,
    },
  });

  const order = data?.getOrder;

  if (order == null) {
    return <div>No order found</div>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>Created: </td>
              <td>b</td>
            </tr>
            <tr>
              <td>id: </td>
              <td>{order.orderId}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <ul>
                  <Status
                    context="Order validation"
                    status={order.orderValid}
                  />
                  <Status context="Your payment" status={order.paymentValid} />
                  <Status
                    context="Restaurant approval"
                    status={order.restaurantApproved}
                  />
                  <Status
                    context="Driver assignment"
                    status={order.driverAssigned}
                  />
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <button onClick={handleCancel}>Cancel</button>
      </main>
    </div>
  );
};

export default Order;
