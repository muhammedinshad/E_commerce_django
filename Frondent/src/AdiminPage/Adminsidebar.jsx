import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  ListOrdered, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

function AdminSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-60">
      
      {/* 👑 Brand Section */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-50">
        <div className="min-width:40px; h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <ShieldCheck size={24} />
        </div>
        <span className="hidden md:block font-black text-slate-900 tracking-tighter text-xl italic">
          CORE<span className="text-indigo-600 underline decoration-slate-200">ADMIN</span>
        </span>
      </div>

      {/* 🧭 Navigation Section */}
      <nav className="flex-1 mt-8 flex flex-col gap-2 px-4">
        <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">
          Main Menu
        </p>

        <SidebarLink to="/adminpage/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/adminpage/adminusers" icon={<Users size={20} />} label="Manage Users" />
        <SidebarLink to="/adminpage/adminproducts" icon={<ShoppingBag size={20} />} label="Inventory" />
        <SidebarLink to="/adminpage/adminorders" icon={<ListOrdered size={20} />} label="Orders" />
      </nav>  
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative ${
          isActive 
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <div className="min-w-5">{icon}</div>
      <span className="hidden md:block font-bold text-sm tracking-tight">
        {label}
      </span>
      
      {/* Tooltip for Mobile View */}
      <span className="md:hidden absolute left-16 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
        {label}
      </span>
    </NavLink>
  );
}

export default AdminSidebar;