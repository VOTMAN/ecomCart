import { Link } from "react-router-dom";

export default function ReceiptModal({ receipt }) {
  return (
    <div className="p-6 text-center border rounded-lg shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-3">✅ Order Confirmed!</h2>
      <p>Order ID: {receipt.orderId}</p>
      <p>Total: ${receipt.total}</p>
      <p className="text-gray-600 mt-2">Thanks for shopping with us!</p>
      <Link
        to="/"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Back to Shop
      </Link>
    </div>
  );
}
