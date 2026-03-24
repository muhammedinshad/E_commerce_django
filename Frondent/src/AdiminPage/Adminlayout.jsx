import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RiHome2Line, RiLogoutCircleLine, RiUserLine } from "react-icons/ri";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import {
  LayoutDashboard, Users, ShoppingBag,
  ListOrdered, ShieldCheck,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/adminpage/dashboard",     icon: <LayoutDashboard size={20} />, label: "Dashboard"    },
  { to: "/adminpage/adminusers",    icon: <Users size={20} />,           label: "Manage Users" },
  { to: "/adminpage/adminproducts", icon: <ShoppingBag size={20} />,     label: "Inventory"    },
  { to: "/adminpage/adminorders",   icon: <ListOrdered size={20} />,     label: "Orders"       },
];

function AdminLayout({ children }) {
  const navigate     = useNavigate();
  const dropdownRef  = useRef(null);
  const [open,        setOpen]        = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex flex-col">

      <header className="w-full h-20 fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 flex justify-between items-center">

        <div className="flex items-center gap-4">

          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
              <span className="text-white font-black text-xl italic">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                Admin <span className="text-indigo-600">Portal</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Management Suite
              </p>
            </div>
          </div>
        </div>

        {/* Right — Home + Profile */}
        <div className="flex items-center gap-3 md:gap-6">

          <button
            onClick={() => navigate("/adminpage/dashboard")}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
            title="Go to site"
          >
            <RiHome2Line size={22} />
          </button>

          <div className="h-8 w-px bg-slate-100 mx-1" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all ${
                open ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-800 uppercase leading-none">
                  Administrator
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Main Access</p>
              </div>
              <FiChevronDown
                className={`text-slate-400 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-2 overflow-hidden z-60">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    admin@store.com
                  </p>
                </div>

                <button
                  onClick={() => { navigate("/adminpage/adminprofile"); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
                >
                  <RiUserLine size={18} /> View Profile
                </button>

                <div className="h-px bg-slate-50 my-1 mx-2" />

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

      {/* ══════════════════════════════════════
          BODY
      ══════════════════════════════════════ */}
      <div className="flex flex-1 pt-20">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-20 left-0 bottom-0 z-40
          w-20 md:w-64
          bg-white border-r border-slate-100
          flex flex-col transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>

          {/* Sidebar brand */}
          <div className="h-16 flex items-center px-4 md:px-6 gap-3 border-b border-slate-50">
            <div className="min-w-10 h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={22} />
            </div>
            <span className="hidden md:block font-black text-slate-900 tracking-tighter text-xl italic">
              CORE<span className="text-indigo-600 underline decoration-slate-200">ADMIN</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 mt-6 flex flex-col gap-2 px-3">
            <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">
              Main Menu
            </p>

            {NAV_LINKS.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
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
                {/* Mobile tooltip */}
                <span className="md:hidden absolute left-16 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer logout */}
          <div className="p-4 border-t border-slate-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <div className="min-w-5">
                <RiLogoutCircleLine size={20} />
              </div>
              <span className="hidden md:block font-bold text-sm tracking-tight">
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 lg:ml-64 ml-0 w-full p-3 sm:p-4 lg:p-6 overflow-auto min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;