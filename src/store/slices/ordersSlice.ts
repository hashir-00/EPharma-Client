import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered';
  orderDate: string;
  estimatedDelivery?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  prescriptionUploaded?: boolean;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'orderDate' | 'status'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: Date.now().toString(),
        orderDate: new Date().toISOString(),
        status: 'Pending',
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { createOrder, updateOrderStatus, setLoading } = ordersSlice.actions;
export default ordersSlice.reducer;