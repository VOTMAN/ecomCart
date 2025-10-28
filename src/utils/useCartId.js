import { useEffect, useState } from "react";
import { v4 } from "uuid";

const useCartId = () => {
	const [cartId, setCartId] = useState(null)
	useEffect(() => {
		let id = localStorage.getItem("cartId")
		if (!id) {
				id = v4();
				localStorage.setItem("cartId", id)
		}
		setCartId(id);
	}, [])

	return cartId;
}

export default useCartId