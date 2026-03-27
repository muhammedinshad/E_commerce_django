import React, { useState,useRef } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiPackage } from "react-icons/fi";
import { NavLink ,useLocation} from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useDispatch } from 'react-redux';
import { setSearch } from '../redux/userSlice';
import { RiHome2Line } from "react-icons/ri";

function NavBar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hideSearchPages = ['/cart', '/order', '/profile', '/placeorder', '/ordersuccess','/login','/register'];
  const showSearch = !hideSearchPages.includes(location.pathname) && !location.pathname.startsWith('/deteals');

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const navItems = [
    { name: "Home", path: "/", icon: <RiHome2Line /> },
    { name: "Order", path: isLoggedIn ? "/order" : "/register", icon: <FiPackage /> },
    { name: "Profile", path: isLoggedIn ? "/profile" : "/register", icon: <CgProfile /> },
    { name: "Cart", path: isLoggedIn ? "/cart" : "/register", icon: <FiShoppingCart /> },
  ];

  const handleSearch = (e) => {
  dispatch(setSearch(e.target.value));
  // Scroll to product section
  const productSection = document.getElementById("product-section");
  if (productSection) {
    productSection.scrollIntoView({ behavior: "smooth" });
  }
};

  return (
    <>
      {/* --- Main Navbar --- */}
      <nav className="fixed top-0 left-0 w-full h-16 flex justify-between items-center bg-white/80 backdrop-blur-md px-4 md:px-12 z-50 shadow-sm border-b border-gray-100">

        <div className="flex items-center gap-4">
          {/* Menu Toggle for Sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu />
          </button>

          {/* Logo */}
          <NavLink to="/" className="text-xl md:text-2xl font-black tracking-tighter text-blue-600">
            SHOE<span className="text-black">CART</span>
          </NavLink>
        </div>

        {/* Search Bar */}
        {showSearch && (
        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            placeholder="Search your style..."
            className="w-full bg-gray-100 border-none py-2 px-4 rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        )}

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-6">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `text-2xl transition-all hover:scale-110 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
              title={item.name}
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* --- Sidebar Overlay --- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* --- Sidebar Drawer --- */}
      <aside className={`fixed top-0 left-0 h-full w-70 bg-white z-70 shadow-2xl transition-transform duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex flex-col h-full">

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-2xl"><FiX /></button>
          </div>

          <div className="space-y-8 overflow-y-auto">

            {/* Search (Visible only in Sidebar on Mobile) */}
            {showSearch && (
            <div className="sm:hidden">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 p-3 rounded-xl"
                onChange={(e) => handleSearch(e)}
              />
            </div>
            )}

            {/* Brands Section */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Brands</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: "Nike", path: "/nike" },
                  { name: "Adidas", path: "/adidas" },
                  { name: "New Balance", path: "/newbalance" },
                  { name: "Puma", path: "/puma" },
                ].map((brand) => (
                  <NavLink
                    key={brand.name}
                    to={brand.path}                           
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium py-1"
                  >
                    {brand.name}
                  </NavLink>
                ))}
              </div>
            </div>

      

          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">© 2026 ShoeCart Inc.</p>
          </div>
        </div>
      </aside>

      <div className="h-16"></div>
    </>
  );
}

export default NavBar;