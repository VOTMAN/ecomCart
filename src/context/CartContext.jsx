import { createContext, useContext, useState, useEffect } from "react";
import useCartId from "../utils/useCartId";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const cartId = useCartId();
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    const local = localStorage.getItem("cartData");
    if (local) {
      try {
        setCart(JSON.parse(local));
      } catch {
        console.warn("Invalid local cart data");
      }
    }
  }, []);

  useEffect(() => {
    if (!cartId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart?cartId=${cartId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart({ items: data.items || [], total: data.total || 0 });
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [cartId]);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.items.find((item) => item.id == product.id);
      let updatedItems;

      if (existing) {
        updatedItems = prev.items.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updatedItems = [...prev.items, { id: product.id || product._id, ...product, qty: 1 }];
      }

      const total = updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      return { items: updatedItems, total };
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      const total = updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      syncToServer(updatedItems);
      return { items: updatedItems, total };
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      );
      const total = updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      syncToServer(updatedItems);
      return { items: updatedItems, total };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
    syncToServer([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
