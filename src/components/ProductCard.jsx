export default function ProductCard({ product, onAdd, added }) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-600">₹{product.price}</p>
      <button
        onClick={onAdd}
        className={`mt-3 px-4 py-2 rounded-lg w-full text-white ${
          added ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {added ? "Add More" : "Add to Cart"}
      </button>
    </div>
  );
}
