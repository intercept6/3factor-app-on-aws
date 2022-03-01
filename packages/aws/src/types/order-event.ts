export type DetailType = 'order status changed';

export interface Detail {
  orderId: string;
  userId: string;
  address: string;
  menuItems: string[];
  orderValid: boolean;
  paymentValid: boolean;
  restaurantApproved: boolean;
  driverAssigned: boolean;
}
