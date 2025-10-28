import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  // Helper: check if product is already in cart
  const isInCart = (id) => cart.items?.some((item) => item.productId === id);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const inCart = isInCart(p.id);
          return (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => addToCart(p.id)}
              added={inCart}
            />
          );
        })}
      </div>
    </div>
  );
}
