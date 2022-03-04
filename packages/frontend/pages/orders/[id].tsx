import { useQuery } from '@apollo/client';
import { Button, TableBody } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  GetOrderDocument,
  OnOrderUpdateDocument,
  Order,
} from '../../src/graphql/generated';
import { usePatchedSubscription } from '../../src/hooks/usePatchedSubscription';
import {
  TableContainer,
  Table,
  TableCell,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import { OrderStatus } from '../../components/OrderStatus';

const Order = () => {
  const router = useRouter();
  const orderId = router.query.id as string;
  const skip = typeof orderId !== 'string' || orderId === '';

  const { data: initData } = useQuery(GetOrderDocument, {
    variables: { orderId },
    skip,
  });
  const { data: subscData } = usePatchedSubscription(OnOrderUpdateDocument, {
    variables: { orderId },
    skip,
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
    return <></>;
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>注文日時</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('ja-Jp', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }).format(new Date(orderData.createdAt))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>オーダーID</TableCell>
                <TableCell>{orderData.orderId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>商品</TableCell>
                <TableCell>{orderData.menuItems.join(', ')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ステータス</TableCell>
                <TableCell>
                  <OrderStatus
                    orderValid={{
                      context: 'Order validation',
                      status: orderData.orderValid,
                    }}
                    paymentValid={{
                      context: 'Your payment',
                      status: orderData.paymentValid,
                    }}
                    restaurantApproved={{
                      context: 'Restaurant approval',
                      status: orderData.restaurantApproved,
                    }}
                    driverAssigned={{
                      context: 'Driver assignment',
                      status: orderData.driverAssigned,
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={() => {
            router.push('/');
          }}
        >
          戻る
        </Button>
      </Grid>
    </Grid>
  );
};

export default Order;
