import React, { useEffect, useState } from "react";
import { getAllOrders, OrderUpdate } from "../../api/api";
import { toast } from "react-toastify";
import {
  FiShoppingBag, FiCheckCircle, FiXCircle,
  FiClock, FiCalendar, FiUser, FiInfo,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

function AdminOrders() {
  const [orders,      setOrdersData] = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);
  const [nextPage,    setNextPage]    = useState(null);
  const [prevPage,    setPrevPage]    = useState(null);

  const getToken = () =>
    localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');

  const getStatusStyles = (status) => {
    switch (status) {
      case "Confirmed":
      case "Confrom":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
      case "Processing":
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      default:
        return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
    }
  };

  // ── Fetch orders ──────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res   = await getAllOrders(token, currentPage);  // ✅ pass page

        const data       = res.data;
        const ordersData = data.results || data;

        setOrdersData(Array.isArray(ordersData) ? ordersData : []);
        setTotalCount(data.count    || 0);
        setNextPage(data.next      || null);
        setPrevPage(data.previous  || null);

      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);  // ✅ refetch on page change

  // ── Actions ───────────────────────────────────────────
  const handleConfirm = async (orderId) => {
    try {
      const token = getToken();
      await OrderUpdate(token, orderId, "Confrom");
      setOrdersData((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Confirmed" } : order
        )
      );
      toast.success("Order approved for fulfillment");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = getToken();
      await OrderUpdate(token, orderId, "Cancelled");
      setOrdersData((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.warn("Order has been cancelled");
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 mt-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FiShoppingBag className="text-indigo-600" />
            Order Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track, confirm, and manage customer shipments
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Order Info</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-400 animate-pulse">
                      Fetching latest orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors group">

                      {/* Order ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-indigo-600">
                          #ORD-{order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <FiUser className="text-gray-400 text-xs" />
                          </div>
                          <span className="font-medium text-gray-800">{order.user}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <FiCalendar size={12} />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 mt-0.5 opacity-70">
                            <FiClock size={12} />
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4">
                        <span className="text-base font-bold text-gray-900">
                          ₹{order.total_price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight ${getStatusStyles(order.status)}`}>
                          {order.status === "Confrom" ? "Confirmed" : order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {order.status !== "Confirmed" &&
                          order.status !== "Confrom" &&
                          order.status !== "Cancelled" ? (
                            <>
                              <button
                                onClick={() => handleConfirm(order.id)}
                                className="flex items-center gap-1 bg-white border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all shadow-sm"
                              >
                                <FiCheckCircle /> Confirm
                              </button>
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="flex items-center gap-1 bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all shadow-sm"
                              >
                                <FiXCircle /> Cancel
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium italic bg-gray-50 px-3 py-1 rounded-lg">
                              <FiInfo size={12} /> Processed
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-400 italic">
                      No orders found in the system
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination Footer ── */}
          {!loading && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">

              {/* Stats */}
              <p className="text-sm text-gray-500 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-700">{orders.length}</span>{" "}
                of{" "}
                <span className="font-bold text-gray-700">{totalCount}</span>{" "}
                total orders
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={!prevPage}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft /> Prev
                </button>

                <span className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100">
                  {currentPage}
                </span>

                <button
                  disabled={!nextPage}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;