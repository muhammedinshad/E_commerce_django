import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getProductByIdDjango, addToCart } from '../../api/api';
import { useDispatch } from 'react-redux';
import { setBuyData } from '../../redux/userSlice';
import { FiArrowLeft, FiShoppingBag, FiZap } from "react-icons/fi";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    getProductByIdDjango(id, token)
      .then((res) => setProduct(res.data))
      .catch((e) => console.log("Fetch error:", e));
  }, [id]);

  if (!product) return (
    <div className="h-screen flex items-center justify-center">Loading...</div>
  );

  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (outOfStock || isAddingToCart || addedToCart) return;
    if (!selectedSize) { toast.info("Select a size"); return; }
    const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    setIsAddingToCart(true);
    addToCart({ product: product.id, size: selectedSize }, token)
      .then(() => {
        toast.success("Added to cart!");
        setAddedToCart(true);
      })
      .catch(() => toast.error("Failed to add to cart."))
      .finally(() => setIsAddingToCart(false));
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    if (!selectedSize) { toast.info("Select a size"); return; }
    dispatch(setBuyData({ ...product, size: selectedSize }));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-4xl w-full rounded-4xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left: Image */}
        <div className="md:w-5/12 bg-slate-100 relative group">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-all"
          >
            <FiArrowLeft size={18} />
          </button>

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-white text-red-600 font-black text-sm px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "grayscale opacity-70" : ""  // ✅ grey out if no stock
              }`}
          />
        </div>

        {/* Right: Content */}
        <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em]">
              {product.brand || "Limited Edition"}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 uppercase italic">
              {product.name}
            </h1>
          </div>

          {/* Price + Stock badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-slate-900">₹{product.price}</span>

            {/* ✅ Dynamic stock badge */}
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${outOfStock
              ? "bg-red-100 text-red-700"
              : product.stock <= 5
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
              }`}>
              {outOfStock
                ? "OUT OF STOCK"
                : product.stock <= 5
                  ? `ONLY ${product.stock} LEFT`
                  : `${product.stock} IN STOCK`}
            </span>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
            Premium craftsmanship meets modern comfort. This {product.name} features
            high-grade materials and a responsive sole for all-day wearability.
          </p>

          {/* Sizes */}
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product?.sizes?.map((s) => (
                <button
                  key={s}
                  onClick={() => !outOfStock && setSelectedSize(s)}
                  disabled={outOfStock}
                  className={`h-10 w-10 text-xs rounded-xl font-bold transition-all flex items-center justify-center border ${outOfStock
                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    : selectedSize === s
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">

            {/* Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || isAddingToCart || addedToCart}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${outOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : addedToCart
                    ? "bg-green-100 text-green-600 cursor-not-allowed"
                    : isAddingToCart
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
            >
              <FiShoppingBag size={16} />
              {addedToCart ? "✓ Added!" : isAddingToCart ? "Adding..." : "Cart"}
            </button>

            {/* Buy Now button */}
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className={`flex-[2] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${outOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                }`}
            >
              <FiZap size={16} />
              {outOfStock ? "Out of Stock" : "Buy Now"}
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Details;