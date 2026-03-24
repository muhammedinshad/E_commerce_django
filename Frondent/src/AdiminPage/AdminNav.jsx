import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome2Line, RiLogoutCircleLine, RiUserLine, RiSettings4Line } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";

function AdminNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="w-full h-20 fixed top-0 left-0 z-100 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 flex justify-between items-center transition-all">
      
      {/* 🚀 Left Side: Brand Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
          <span className="text-white font-black text-xl italic">A</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
            Admin <span className="text-indigo-600">Portal</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Management Suite</p>
        </div>
      </div>

      {/* 🛠️ Right Side: Navigation & Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Quick Access Home */}
        <button
          onClick={() => navigate("/adminpage/dashboard")}
          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
          title="Dashboard"
        >
          <RiHome2Line size={22} />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-1px bg-slate-100 mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all ${
              open ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-slate-800 uppercase leading-none">Administrator</p>
              <p className="text-[10px] text-slate-400 font-medium">Main Access</p>
            </div>
            <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Elegant Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p className="text-sm font-bold text-slate-800 truncate">admin@store.com</p>
              </div>

              <button
                onClick={() => { navigate("/adminpage/adminprofile"); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
              >
                <RiUserLine size={18} /> View Profile
              </button>

            

              <div className="h-1px bg-slate-50 my-1 mx-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <RiLogoutCircleLine size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNav;