import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getOrders,updateOrder } from "../../api/api";
import { FiBox, FiMapPin, FiCalendar, FiArrowRight, FiXCircle } from "react-icons/fi";

function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(orders)
  useEffect(() => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    if (!token) {
      toast.error("Please login to view your orders!");
      navigate("/login");
      return;
    }

    getOrders(token)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("fetch error:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleCancel = async (orderId) => {
    let token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
    
    try {
      await updateOrder(orderId, token,"Cancelled"); 
      
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
            <FiBox className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm mb-4">No orders found.</p>
            <button onClick={() => navigate("/")} className="text-sm font-bold text-blue-600 hover:underline">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order Top Bar - Slim */}
                  <div className="bg-gray-50/50 px-4 py-2 flex justify-between items-center border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID:</span>
                      <span className="text-xs font-mono font-bold text-gray-600">#{order.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <FiCalendar />
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${order.status === "Cancelled" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Content - Compact */}
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* Items Mini List */}
                      <div className="flex-1 space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded text-[10px] flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                              sz {item.size}
                            </div>
                            <div className="leading-tight">
                              <p className="text-sm font-bold text-gray-800">{item.product}</p>
                              <p className="text-[11px] text-gray-400 truncate max-w-50"><FiMapPin className="inline mr-1" />{order.address}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total and Actions - Tight */}
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total</p>
                          <p className="text-lg font-black text-gray-900">₹{order.total_price}</p>
                        </div>

                        <div className="flex gap-2">
                          {order.status !== "Cancelled" && (
                            <button onClick={()=>handleCancel(order.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <FiXCircle size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrderPage;