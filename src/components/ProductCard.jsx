export default function ProductCard({ product, onAdd, qty }) {
  const isInCart = qty > 0;
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition flex flex-col">
      <img
        src={product.img}
        alt={product.name}
        className="h-48 w-full object-contain mb-3"
      />
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-600 mb-1">${product.price}</p>
      {isInCart && (
        <p className="text-sm text-green-700 font-medium">
          In Cart: <span className="font-bold">{qty}</span>
        </p>
      )}

      <button
        onClick={onAdd}
        className={`mt-auto px-4 py-2 rounded-lg w-full text-white ${
          isInCart ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isInCart ? "Add More" : "Add to Cart"}
      </button>
    </div>
  );
}
