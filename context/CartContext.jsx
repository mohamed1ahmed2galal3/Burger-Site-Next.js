"use client";

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product) {
    const productId = product._id || product.id;
    setCartItems((prev) => {
      const exists = prev.find((item) => item.productId === productId);
      if (exists) {
        toast.success(`${product.name} اتضاف مرة أخرى 🍔`);
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} اتضاف للسلة ✅`);
      return [...prev, { ...product, productId, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (item) toast.error(`${item.name} اتحذف من السلة 🗑️`);
      return prev.filter((item) => item.productId !== productId);
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (item) {
        const isIncrease = quantity > item.quantity;
        toast(isIncrease ? `${item.name} +1 ⬆️` : `${item.name} -1 ⬇️`, {
          icon: isIncrease ? "➕" : "➖",
        });
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
