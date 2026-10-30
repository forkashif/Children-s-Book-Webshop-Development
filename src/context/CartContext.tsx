import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types/store.js';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  updateDedication: (variantId: string, text: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('starlight_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('starlight_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity || 1;
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.variant_id === newItem.variant_id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += qty;
        if (newItem.dedication_text !== undefined) {
          copy[existingIndex].dedication_text = newItem.dedication_text;
        }
        return copy;
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems(prev => prev.filter(i => i.variant_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems(prev => prev.map(i => i.variant_id === variantId ? { ...i, quantity } : i));
  };

  const updateDedication = (variantId: string, text: string) => {
    setItems(prev => prev.map(i => i.variant_id === variantId ? { ...i, dedication_text: text } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateDedication,
        clearCart,
        totalCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
