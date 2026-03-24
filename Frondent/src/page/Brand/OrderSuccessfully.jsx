import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccessfully() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Main Card Container */}
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10 text-center relative overflow-hidden">
        
        {/* Top Decorative Circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full mb-8"></div>

        {/* Success Icon Wrapper */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce">
            <svg 
              className="w-10 h-10 text-white -rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          ORDER PLACED!
        </h1>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          Your style is on the way. We’ve sent the receipt to your registered email.
        </p>

        {/* Status Mini-Card */}
        <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-10 border border-slate-100">
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</p>
            <p className="text-slate-800 font-bold text-sm">Express Shipping</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
            <p className="text-slate-800 font-bold text-sm">2-4 Days</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate("/profile")}
            className="w-full py-4 bg-white text-slate-500 rounded-2xl font-black text-sm tracking-widest uppercase hover:text-slate-900 transition-all border border-transparent"
          >
            Track My Order
          </button>
        </div>

        {/* Footer Accent */}
        <div className="mt-8">
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessfully;