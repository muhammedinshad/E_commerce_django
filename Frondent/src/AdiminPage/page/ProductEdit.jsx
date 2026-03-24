import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductByIdDjango, updateProduct } from "../../api/api";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    image: "",
  });

  // ✅ Fetch the product data first and fill the form
  useEffect(() => {
    const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    getProductByIdDjango(id, token)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
      await updateProduct(id, formData, token);
      toast.success("✅ Product updated successfully!");
      navigate("/adminpage/adminproducts");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(" Failed to update product.");
    }
  };

  return (
    <div className="mt-20 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        ✏️ Edit Product
      </h2>

      {/* 🖼️ Image Preview */}
      {formData.image && (
        <div className="flex justify-center mb-4">
          <img
            src={formData.image}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/adminpage/adminproducts")}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg py-2 px-4"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEdit;
