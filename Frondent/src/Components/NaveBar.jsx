import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  // Reusable scroll function pointing to /product/
  const scrollToProducts = () => {
    if (location.pathname !== '/product/') {
      navigate('/product/'); // Always navigate to /product/
      setTimeout(() => {
        document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
        <nav className={`
          flex justify-between items-center transition-all duration-500 ease-in-out pointer-events-auto
          ${scrolled 
            ? "w-[90%] max-w-4xl mt-4 h-14 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-6 shadow-lg" 
            : "w-full h-20 bg-transparent px-6 md:px-16"
          }
        `}>

          {/* --- Logo --- */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5 bg-white p-1 rounded-[30%] shadow-sm">
              <div className="w-4 h-1 bg-[#FF8A65]"></div>
              <div className="w-4 h-1 bg-[#FFD54F]"></div>
              <div className="w-4 h-1 bg-[#4FC3F7]"></div>
            </div>
            <NavLink 
              to="/" 
              className={`text-lg font-black uppercase tracking-tighter transition-colors ${scrolled ? 'text-black' : 'text-white'}`}
            >
              Shoes
            </NavLink>
          </div>

          {/* --- Center Links --- */}
          <div className={`hidden md:flex items-center gap-8 font-medium transition-colors ${scrolled ? 'text-black' : 'text-white'}`}>
            <NavLink to="/" className="hover:opacity-70 transition-opacity text-sm">Home</NavLink>
            
            <button 
              onClick={scrollToProducts} 
              className="hover:opacity-70 transition-opacity text-sm font-medium focus:outline-none"
            >
              Products
            </button>

            <NavLink to="/about" className="hover:opacity-70 transition-opacity text-sm">About</NavLink>
          </div>

          {/* --- Right Actions --- */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Search Option Removed as requested */}

            <NavLink 
              to={isLoggedIn ? "/profile" : "/register"} 
              className={`text-2xl transition-all hover:scale-110 ${scrolled ? 'text-black' : 'text-white'}`}
              title="Account"
            >
              <CgProfile />
            </NavLink>

            <NavLink 
              to="/cart" 
              className={`text-xl transition-all hover:scale-110 ${scrolled ? 'text-black' : 'text-white'}`}
              title="Cart"
            >
              <FiShoppingCart />
            </NavLink>

            <button 
              onClick={() => setSidebarOpen(true)}
              className={`text-xl md:hidden transition-colors ${scrolled ? 'text-black' : 'text-white'}`}
            >
              <FiMenu />
            </button>
          </div>
        </nav>
      </div>

      {/* --- Sidebar --- */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg font-black uppercase tracking-widest text-black">Menu</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-xl text-black"><FiX /></button>
          </div>
          <div className="flex flex-col gap-5 text-base font-medium text-gray-800">
            <NavLink to="/" onClick={() => setSidebarOpen(false)} className="hover:text-black">Home</NavLink>
            
            <button onClick={scrollToProducts} className="text-left hover:text-black">Shop Products</button>
            
            <NavLink to="/about" onClick={() => setSidebarOpen(false)} className="hover:text-black">About</NavLink>
            <NavLink to="/cart" onClick={() => setSidebarOpen(false)} className="hover:text-black">My Cart</NavLink>
            <NavLink to={isLoggedIn ? "/profile" : "/register"} onClick={() => setSidebarOpen(false)} className="hover:text-black">Account</NavLink>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default NavBar;