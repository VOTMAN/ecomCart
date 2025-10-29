// src/utils/useCartId.js
import { useEffect, useState } from "react";

export default function useCartId() {
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("cartId");
	
    if (!id || id === "undefined" || id === "null" || id.trim() === "") {
      id = crypto.randomUUID();
      console.log("Generated new cartId:", id);
      localStorage.setItem("cartId", id);
    } else {
      console.log("Existing cartId found:", id);
    }
	
    setCartId(id);
  }, []);

  return cartId;
}
