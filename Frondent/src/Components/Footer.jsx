import React from "react";
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">

          {/* Brand & Mission */}
          <div className="max-w-xs">
            <h2 className="text-xl font-black tracking-tighter text-gray-900 mb-4">
              SOLE<span className="text-blue-600">SCRIPT.</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curating the finest sneakers for the modern collector.
              Quality and authenticity, delivered to your door.
            </p>
          </div>

          {/* Minimal Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Shop</p>
              <NavLink to="/nike" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Nike</NavLink>
              <NavLink to="/adidas" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Adidas</NavLink>
              <NavLink to="/new-arrivals" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">New Drops</NavLink>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Service</p>
              <NavLink to="/orders" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Track Order</NavLink>
              <NavLink to="/shipping" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Shipping</NavLink>
              <NavLink to="/contact" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Help</NavLink>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Social</p>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                <FaInstagram /> Instagram
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                <FaTwitter /> Twitter
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                <FaDiscord /> Discord
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Ultra Clean */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-300 font-medium">
            © {year} SOLESCRIPT INC. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-8">
            <NavLink to="/privacy" className="text-[11px] text-gray-300 hover:text-gray-900 transition-colors font-bold uppercase tracking-widest">Privacy</NavLink>
            <NavLink to="/terms" className="text-[11px] text-gray-300 hover:text-gray-900 transition-colors font-bold uppercase tracking-widest">Terms</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;