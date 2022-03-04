import styles from './OrderStatus.module.css';

const OrderStatusLine = ({
  context,
  status,
}: {
  context: string;
  status: boolean;
}) => {
  return (
    <li className={styles.line}>
      {status ? '✅' : '❌'}{' '}
      <p style={{ display: 'inline', color: status ? 'green' : undefined }}>
        {context}
      </p>
    </li>
  );
};

export const OrderStatus = (props: {
  orderValid: { context: string; status: boolean };
  paymentValid: { context: string; status: boolean };
  restaurantApproved: { context: string; status: boolean };
  driverAssigned: { context: string; status: boolean };
}) => {
  return (
    <ul>
      <OrderStatusLine context="注文の検証" status={props.orderValid.status} />
      <OrderStatusLine context="支払い" status={props.paymentValid.status} />
      <OrderStatusLine
        context="レストランの受け付け"
        status={props.restaurantApproved.status}
      />
      <OrderStatusLine
        context="ドライバーのアサイン"
        status={props.driverAssigned.status}
      />
    </ul>
  );
};
