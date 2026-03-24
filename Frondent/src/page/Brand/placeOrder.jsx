import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProfile, getCart, createOrder, clearCart } from "../../api/api";
import { FiMapPin, FiPackage, FiCreditCard, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

function PlaceOrder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [address, setAddress] = useState("");
  const buyData = useSelector((state) => state.user.buyData);

  useEffect(() => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    if (!token) {
      toast.warn("Session expired. Please login.");
      navigate("/login");
      return;
    }

    getProfile(token)
      .then((res) => setUser(res.data))
      .catch((err) => console.log("Profile error:", err));

    if (buyData && Object.keys(buyData).length > 0) {
      const price = parseFloat(String(buyData.price).replace(/[^0-9.]/g, "") || 0);
      setCartData({ items: [buyData], total: price });
    } else {
      getCart(token)
        .then((res) => {
          setCartData({
            items: res.data.cart_items || [],
            total: res.data.cart_total || 0
          });
        })
        .catch((err) => console.log("Cart error:", err));
    }
  }, [navigate, buyData]);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast.warn("Delivery address is required!");
      return;
    }

    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    const orderItems = cartData.items.map(item => ({
      product: item.product_name || item.name,
      quantity: item.quantity || 1,
      price: item.price || item.product_price,
      size: item.size || item.product?.size
    }));

    const orderPayload = {
      user: user?.username,
      address: address,
      items: orderItems,
      total_price: cartData.total
    };

    createOrder(orderPayload, token)
      .then(async () => {
        toast.success("Order confirmed!");
        if (!buyData || Object.keys(buyData).length === 0) {
          try { await clearCart(token); } catch (e) { console.error(e); }
        }
        navigate("/ordersuccess");
      })
      .catch((err) => toast.error("Failed to place order."));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-all text-slate-500 hover:text-slate-900"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <div className="w-10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Side: Forms */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Delivery Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FiMapPin size={20} />
                </div>
                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Delivery Address</h2>
              </div>
              <textarea
                rows="4"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Flat No, Building, Street, Landmark, City, Pincode..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            {/* Payment Method (Mockup) */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FiCreditCard size={20} />
                </div>
                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Payment Method</h2>
              </div>
              <div className="p-4 border-2 border-emerald-500 bg-emerald-50/50 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-emerald-700">Cash on Delivery</span>
                <FiCheckCircle className="text-emerald-500" />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28"
          >
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200">
              <div className="flex items-center gap-3 mb-8">
                <FiPackage className="text-indigo-400" />
                <h2 className="font-bold uppercase text-xs tracking-widest text-indigo-200">Order Summary</h2>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cartData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{item.product?.product_name || item.name || item.product_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Qty: {item.quantity || 1} • Size: {item.size || item.product?.size}</p>
                    </div>
                    <p className="font-bold text-indigo-400 text-sm ml-4">₹{item.price || item.product_price}</p>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Subtotal</span>
                  <span>₹{cartData.total}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>Total</span>
                  <span className="text-white font-black text-2xl tracking-tighter">₹{cartData.total}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
              >
                Confirm Order <FiCheckCircle size={22} />
              </button>
            </div>
            
            <p className="text-center mt-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              🔒 SSL Encrypted Checkout
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;