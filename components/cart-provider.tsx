"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../lib/shop";
import { getProductPrice } from "../lib/shop";

export type CartItem = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "Delight-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                Number.isInteger(item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                Number.isFinite(item.price) &&
                Number.isFinite(item.stock)
            ).map((item) => ({
              ...item,
              quantity: Math.min(item.quantity, Math.max(0, item.stock)),
            })).filter((item) => item.quantity > 0)
          );
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock <= 0 || quantity < 1) return false;

      let added = false;

      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        const currentQuantity = existing?.quantity ?? 0;
        const nextQuantity = Math.min(
          currentQuantity + Math.floor(quantity),
          product.stock
        );

        if (nextQuantity <= currentQuantity) return current;

        added = true;

        const item: CartItem = {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: getProductPrice(product),
          stock: product.stock,
          quantity: nextQuantity,
        };

        return existing
          ? current.map((entry) =>
              entry.id === product.id ? item : entry
            )
          : [...current, item];
      });

      return added;
    },
    []
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(0, Math.floor(quantity) || 0),
                  item.stock
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}