import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">🛍️ Vibe Commerce</Link>
      <Link to="/cart" className="font-medium">
        Cart ({cart.items?.length || 0})
      </Link>
    </nav>
  );
}
