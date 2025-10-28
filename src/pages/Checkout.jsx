import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ReceiptModal from "../components/ReceiptModal";

export default function Checkout() {
  const { cart, emptyCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/checkout", {
      cartId: localStorage.getItem("cartId"),
      ...form,
    });
    setReceipt(res.data);
    emptyCart()
  };

  if (receipt) return <ReceiptModal receipt={receipt} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 w-full rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
      >
        Complete Checkout
      </button>
      <p className="text-center mt-2 text-gray-600">Total: ₹{cart.total}</p>
    </form>
  );
}
