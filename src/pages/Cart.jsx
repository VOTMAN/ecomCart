import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart = { items: [], total: 0 }, addToCart, updateQty, removeFromCart, deleteItem } = useCart();
  const [loadingMap, setLoadingMap] = useState({});

  const setLoading = (id, val) =>
    setLoadingMap((s) => ({ ...s, [id]: val }));

  const handleDecrease = async (productId) => {
    setLoading(productId, true);
    try {
      if (typeof updateQty === "function") {
        await updateQty(productId, -1);
      } else if (typeof addToCart === "function") {
        await addToCart(productId, -1);
      } else {
        console.error("No updateQty or addToCart available in CartContext");
      }
    } catch (err) {
      console.error("Error decreasing qty:", err);
    } finally {
      setLoading(productId, false);
    }
  };

  const handleIncrease = async (productId) => {
    setLoading(productId, true);
    try {
      if (typeof updateQty === "function") {
        await updateQty(productId, 1);
      } else if (typeof addToCart === "function") {
        await addToCart(productId, 1);
      } else {
        console.error("No updateQty or addToCart available in CartContext");
      }
    } catch (err) {
      console.error("Error increasing qty:", err);
    } finally {
      setLoading(productId, false);
    }
  };

  const handleRemove = async (productId) => {
    setLoading(productId, true);
    try {
      if (typeof deleteItem === "function") {
        await deleteItem(productId);
      } else if (typeof removeFromCart === "function") {
        await removeFromCart(productId);
      } else {
        if (typeof addToCart === "function") {
          await addToCart(productId, -9999);
        } else {
          console.error("No remove/delete function available in CartContext");
        }
      }
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(productId, false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {(!cart.items || cart.items.length === 0) ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item) => {
            const loading = !!loadingMap[item.productId];
            return (
              <div
                key={item.productId}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600">₹{item.price} x {item.qty}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(item.productId)}
                    disabled={loading}
                    className="bg-gray-200 px-2 rounded disabled:opacity-50"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    {loading ? "…" : "-"}
                  </button>

                  <span className="px-2">{item.qty}</span>

                  <button
                    onClick={() => handleIncrease(item.productId)}
                    disabled={loading}
                    className="bg-gray-200 px-2 rounded disabled:opacity-50"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    {loading ? "…" : "+"}
                  </button>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 rounded disabled:opacity-50"
                    aria-label={`Remove ${item.name}`}
                  >
                    {loading ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right font-semibold text-lg">
            Total: ${(cart.total).toFixed(2)}
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
