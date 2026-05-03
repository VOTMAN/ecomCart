import { createContext, useContext, useState, useEffect } from "react";
import useCartId from "../utils/useCartId";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const cartId = useCartId();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loaded, setLoaded] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // "add" | "update" | "remove" | "checkout"

  useEffect(() => {
    if (!cartId) return;
    const fetchCart = async () => {
      setLoaded(false);
      const resp = await fetch(`https://ecomcartserver.onrender.com/api/cart?cartId=${cartId}`);
      const data = await resp.json();
      setCart(data);
      setLoaded(true);
    };
    fetchCart();
  }, [cartId]);

  const modifyCart = async (prodId, qty, action = "add") => {
    setLoadingAction(action);
    try {
      const resp = await fetch("https://ecomcartserver.onrender.com/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, prodId, qty }),
      });
      const data = await resp.json();
      setCart(data);
    } catch (err) {
      console.error("Error modifying cart:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const addToCart = (prodId) => modifyCart(prodId, 1, "add");
  const updateQty = (prodId, qty) => modifyCart(prodId, qty, "update");

  const deleteItem = async (id) => {
    setLoadingAction("remove");
    try {
      const resp = await fetch(`https://ecomcartserver.onrender.com/api/cart/${id}?cartId=${cartId}`, {
        method: "DELETE",
      });
      const data = await resp.json();
      setCart(data.cart);
    } catch (err) {
      console.error("Error deleting item:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const checkout = async (name, email) => {
    setLoadingAction("checkout");
    try {
      const resp = await fetch("https://ecomcartserver.onrender.com/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, name, email }),
      });
      const data = await resp.json();
      setCart({ items: [], total: 0 });
      return data;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, deleteItem, checkout, loaded, loadingAction }}
    >
      {children}
    </CartContext.Provider>
  );
};
