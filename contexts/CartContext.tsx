import React, { createContext, useContext, useState } from 'react';

export interface Door {
  id: string;
  name: string;
  price: number;
  image: any; // Can be require() result or string URI
  category: string;
  description: string;
}

export interface CartItem extends Door {
  quantity: number;
  width: string;
  height: string;
  thickness: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (door: Door, width: string, height: string, thickness: string) => void;
  removeFromCart: (doorId: string) => void;
  updateQuantity: (doorId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (door: Door, width: string, height: string, thickness: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === door.id && 
        item.width === width && 
        item.height === height && 
        item.thickness === thickness
      );
      if (existingItem) {
        return prevItems.map(item =>
          item.id === door.id && 
          item.width === width && 
          item.height === height && 
          item.thickness === thickness
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { 
        ...door, 
        quantity: 1, 
        width, 
        height, 
        thickness 
      }];
    });
  };

  const removeFromCart = (doorId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== doorId));
  };

  const updateQuantity = (doorId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(doorId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === doorId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 