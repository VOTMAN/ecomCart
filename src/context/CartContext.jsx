import { createContext, useContext, useEffect, useState } from "react";
import useCartId from "../utils/useCartId";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CART_API = "http://localhost:5000/api/cart";

export const CartProvider = ({ children }) => {
  const [cartId] = useState(() => {
    let id = localStorage.getItem("cartId");
    if (!id) {
      id = useCartId();
      localStorage.setItem("cartId", id);
    }
    return id;
  });
  const [cart, setCart] = useState({ items: [], total: 0 });

  const fetchCart = async () => {
    const res = await axios.get(CART_API, { params: { cartId } });
    setCart(res.data || { items: [], total: 0 });
  };

  const addToCart = async (prodId, qty = 1) => {
    const res = await axios.post(CART_API, { cartId, prodId, qty });
    setCart(res.data);
  };

  const removeFromCart = async (prodId) => {
    const res = await axios.delete(`${CART_API}/${prodId}`, { params: { cartId } });
    setCart(res.data.cart);
  };

  const emptyCart = async () => {
    // const res = await axios.post(`http://localhost:5000/api/clearCart`, { cartId })
    setCart({ items: [], total: 0 })
  }

  useEffect(() => { fetchCart(); }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};
