import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loadingItems, setLoadingItems] = useState({}); // { [productId]: true/false }
  const { cart, addToCart, updateQty } = useCart();

  // Fetch products from Fake Store API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Helper to get quantity of an item from the cart
  const getQty = (id) => {
    const item = cart.items?.find((i) => i.productId === id);
    return item ? item.qty : 0;
  };

  // Add to cart handler with per-item loading
  const handleAdd = async (id) => {
    setLoadingItems((prev) => ({ ...prev, [id]: true }));
    try {
      await addToCart(id);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Update quantity (+1 or -1)
  const handleUpdate = async (id, change) => {
    setLoadingItems((prev) => ({ ...prev, [id]: true }));
    try {
      await updateQty(id, change);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">🛍️ Products</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const qty = getQty(p.id);
          const isLoading = loadingItems[p.id];

          return (
            <div
              key={p.id}
              className="border rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={p.img}
                alt={p.name}
                className="h-40 w-40 object-contain mb-3"
              />
              <h3 className="font-semibold text-center mb-1 text-sm sm:text-base">
                {p.name}
              </h3>
              <p className="text-gray-700 mb-3 font-medium">${p.price.toFixed(2)}</p>

              {qty > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdate(p.id, -1)}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="font-medium">{isLoading ? "…" : qty}</span>
                  <button
                    onClick={() => handleUpdate(p.id, 1)}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAdd(p.id)}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isLoading ? "Adding…" : "Add to Cart"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
