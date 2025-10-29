import {
    off,
    onValue,
    push,
    ref,
    remove,
    serverTimestamp,
    update
} from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../firebase/config';

export interface Order {
  id: string;
  userId: string;
  doorId: string;
  doorName: string;
  doorImage: any;
  doorCategory: string;
  price: number;
  width: string;
  height: string;
  thickness: string;
  name: string;
  address: string;
  phoneNumber: string;
  pincode: string;
  state: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status' | 'userId'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to orders in Firebase Realtime Database
  useEffect(() => {
    if (!database) {
      console.error('Database not initialized');
      setLoading(false);
      return;
    }

    const ordersRef = ref(database, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const ordersArray: Order[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          // Sort by orderDate descending
          ordersArray.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          setOrders(ordersArray);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error processing orders data:', error);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error listening to orders:', error);
      setLoading(false);
    });

    return () => {
      try {
        off(ordersRef, 'value', unsubscribe);
      } catch (error) {
        console.error('Error removing listener:', error);
      }
    };
  }, [database]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'userId'>) => {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      
      const orderDataWithTimestamp = {
        ...orderData,
        orderDate: serverTimestamp(),
        status: 'pending',
      };
      
      await update(newOrderRef, orderDataWithTimestamp);
      console.log('Order added to Realtime Database with ID:', newOrderRef.key);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const orderRef = ref(database, `orders/${orderId}`);
      const updates: any = { status };
      
      if (status === 'delivered') {
        updates.deliveryDate = serverTimestamp();
      }
      
      await update(orderRef, updates);
      console.log('Order status updated:', orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const orderRef = ref(database, `orders/${orderId}`);
      await remove(orderRef);
      console.log('Order cancelled:', orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    cancelOrder,
    getUserOrders,
    getAllOrders,
    loading,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};