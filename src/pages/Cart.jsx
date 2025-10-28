import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, addToCart, removeFromCart } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex justify-between border p-3 rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">₹{item.price} × {item.qty}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item.productId, -1)}
                  className="bg-gray-200 px-2 rounded"
                >−</button>
                <button
                  onClick={() => addToCart(item.productId, 1)}
                  className="bg-gray-200 px-2 rounded"
                >+</button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="bg-red-500 text-white px-3 rounded"
                >Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right font-semibold text-lg">
            Total: ₹{cart.total}
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
