import { useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  CreateOrderDocument,
  GetAllOrdersDocument,
} from '../src/graphql/generated';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { OrderStatus } from '../components/OrderStatus';

const Home: NextPage = () => {
  const { push } = useRouter();

  const [menuItems, setMenuItems] = useState({
    '🍕 ピザ': false,
    '🍔 ハンバーガー': false,
    '🍟 ポテト': false,
    '🥤 コーラ': false,
    '☕️ コーヒー': false,
  });

  const [mutateFunction, { data }] = useMutation(CreateOrderDocument);

  const handleOrder = async () => {
    await mutateFunction();
  };

  useEffect(() => {
    if (data?.createOrder.orderId != null) {
      push(`/orders/${data?.createOrder.orderId}`);
    }
  }, [push, data]);

  const { data: allOrders } = useQuery(GetAllOrdersDocument);

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h2">
          3factor app example on AWS(AppSync)
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h3">メニュー</Typography>
      </Grid>
      <Grid item>
        <FormGroup>
          {Object.keys(menuItems).map((key) => {
            return (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    onChange={({ target }) => {
                      setMenuItems({
                        ...menuItems,
                        [key]: target.checked,
                      });
                    }}
                    name={key}
                  />
                }
                label={key}
              />
            );
          })}
        </FormGroup>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleOrder}>
          注文する
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h3">注文一覧</Typography>
      </Grid>
      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">id</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableHead>
            <TableBody>
              {allOrders?.getAllOrders?.map((order) => {
                return (
                  <TableRow key={order.orderId}>
                    <TableCell>
                      {new Intl.DateTimeFormat('ja-Jp', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(new Date(order.createdAt))}
                    </TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>
                      <OrderStatus
                        orderValid={{
                          context: 'Order validation',
                          status: order.orderValid,
                        }}
                        paymentValid={{
                          context: 'Your payment',
                          status: order.paymentValid,
                        }}
                        restaurantApproved={{
                          context: 'Restaurant approval',
                          status: order.restaurantApproved,
                        }}
                        driverAssigned={{
                          context: 'Driver assignment',
                          status: order.driverAssigned,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Home;
