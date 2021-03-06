import { useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  CreateOrderDocument,
  GetAllOrdersDocument,
} from '../src/graphql/generated';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Snackbar,
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
  const [open, setOpen] = useState(false);

  const [menuItems, setMenuItems] = useState({
    '๐ ใใถ': false,
    '๐ ใใณใใผใฌใผ': false,
    '๐ ใใใ': false,
    '๐ฅค ใณใผใฉ': false,
    'โ๏ธ ใณใผใใผ': false,
  });

  const [mutateFunction, { data }] = useMutation(CreateOrderDocument);

  const handleOrder = async () => {
    const myOrder = Object.entries(menuItems).flatMap(([key, value]) =>
      value === false ? [] : [key.split(' ')[1]]
    );
    if (myOrder.length < 1) {
      setOpen(true);
      return;
    }

    await mutateFunction({
      variables: {
        menuItems: myOrder,
      },
    });
  };

  useEffect(() => {
    if (data?.createOrder.orderId != null) {
      push(`/orders/${data?.createOrder.orderId}`);
    }
  }, [push, data]);

  const { data: allOrders } = useQuery(GetAllOrdersDocument);

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          console.log({ reason });
          if (reason === 'clickaway') {
            setOpen(false);
          }
        }}
      >
        <Alert severity="error">
          1ใคไปฅไธใฎๅๅใ้ธๆใใฆๆณจๆใใๅฟ่ฆใใใใพใ
        </Alert>
      </Snackbar>
      <Grid item>
        <Typography variant="h2">
          3factor app example on AWS(AppSync)
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h3">ใกใใฅใผ</Typography>
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
          ๆณจๆใใ
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h3">ๆณจๆไธ่ฆง</Typography>
      </Grid>
      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ๆณจๆๆฅๆ</TableCell>
                <TableCell align="center">ใชใผใใผID</TableCell>
                <TableCell align="center">ๅๅ</TableCell>
                <TableCell align="center">ในใใผใฟใน</TableCell>
              </TableRow>
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
                    <TableCell>{order.menuItems.join(', ')}</TableCell>
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
