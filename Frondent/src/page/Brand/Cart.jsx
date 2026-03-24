import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getCart, removeFromCart } from '../../api/api';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiChevronRight } from "react-icons/fi";

function Cart() {
  const [product, setProduct] = useState({ cart_items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    if (!token) return;

    getCart(token)
      .then((res) => setProduct(res.data))
      .catch((e) => console.log("Fetch error: ", e));
  }, []);

  const remove = (id) => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    removeFromCart(id, token)
      .then(() => {
        setProduct((prev) => {
          const updatedItems = prev.cart_items.filter((item) => item.id !== id);
          // Recalculate total locally for instant UI update
          const newTotal = updatedItems.reduce((acc, item) => acc + (item.product?.product_price || item.product_price) * item.quantity, 0);
          return { ...prev, cart_items: updatedItems, cart_total: newTotal };
        });
        toast.success("Removed from cart");
      })
      .catch(() => toast.error("Failed to remove item."));
  };

  const cartEmpty = !product.cart_items || product.cart_items.length === 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Bag</h1>
            <p className="text-slate-500 font-medium">Items are reserved for 60 minutes</p>
          </div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* 🟢 Items List (Left Side) */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode='popLayout'>
              {cartEmpty ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white rounded-2rem p-12 text-center border border-slate-100 shadow-sm"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FiShoppingBag size={40} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Your bag is empty</h2>
                  <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
                  <button onClick={() => navigate("/")} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                    Explore Products
                  </button>
                </motion.div>
              ) : (
                product.cart_items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    className="bg-white p-4 rounded-1.5rem shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all"
                  >
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink:0">
                      <img
                        src={item.product?.image || item.product_image}
                        alt="Product"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-slate-900 truncate uppercase text-sm tracking-tight">
                        {item.product?.product_name || item.product_name}
                      </h2>
                      <p className="text-indigo-600 font-black">₹{item.product?.product_price || item.product_price}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">Size: {item.size || 'N/A'}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => remove(item.id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* 🔴 Summary Sidebar (Right Side) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2rem p-8 shadow-xl shadow-slate-200/50 border border-slate-50 sticky top-28">
              <h2 className="text-xl font-black text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex justify-between text-slate-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{product.cart_total || 0}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium text-sm">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold tracking-tight uppercase text-xs">Free</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium text-sm">
                  <span>Tax (included)</span>
                  <span className="text-slate-900 font-bold">₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{product.cart_total || 0}</p>
                </div>
              </div>

              {!cartEmpty && (
                <button 
                  onClick={() => navigate("/placeorder")}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 hover:-translate-y-1 shadow-lg shadow-indigo-100 transition-all active:scale-95 mb-4"
                >
                  Checkout <FiChevronRight />
                </button>
              )}
              
              <div className="flex items-center gap-2 justify-center text-slate-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;