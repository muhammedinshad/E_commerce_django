import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { getProfile } from '../../api/api';
import { FiLogOut, FiShoppingCart, FiPackage, FiMail, FiUser, FiArrowRight } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    getProfile(token)
      .then((res) => setUser(res.data))
      .catch((error) => {
        console.log("Profile fetch data error:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    try {
      let accessToken = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");
      const { logoutDjangoUser } = await import('../../api/api');

      await logoutDjangoUser({ refresh: refreshToken }, accessToken);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      localStorage.clear();
      navigate("/");
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">

        {/* --- Header & Profile Branding --- */}
        <div className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="relative">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Avatar"
              className="w-32 h-32 rounded-[2rem] object-cover shadow-2xl shadow-blue-100 border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Hello,{user.username}
            </h1>
            <p className="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
              <FiUser className="text-blue-500" /> Account ID: #{user.id}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm font-semibold text-gray-600">
                <FiMail className="text-blue-500" /> {user.email}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            <FiLogOut /> Log out
          </button>
        </div>

        {/* --- Quick Actions Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Cart Card */}
          <NavLink
            to="/cart"
            className="group relative bg-blue-600 p-8 rounded-[2.5rem] text-white overflow-hidden shadow-xl shadow-blue-100 transition-transform hover:-translate-y-2"
          >
            <div className="relative z-10">
              <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-4">
                <FiShoppingCart size={24} />
              </div>
              <h3 className="text-2xl font-bold">My Cart</h3>
              <p className="text-blue-100 mt-1 opacity-80">Check your saved sneakers</p>
              <div className="mt-6 flex items-center gap-2 font-bold">
                View Bag <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            {/* Background Decoration */}
            <FiShoppingCart className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48 rotate-12" />
          </NavLink>

          {/* Orders Card */}
          <NavLink
            to="/order"
            className="group relative bg-white p-8 rounded-[2.5rem] text-gray-900 overflow-hidden shadow-sm border border-gray-100 transition-transform hover:-translate-y-2"
          >
            <div className="relative z-10">
              <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FiPackage size={24} />
              </div>
              <h3 className="text-2xl font-bold">My Orders</h3>
              <p className="text-gray-400 mt-1">Track and manage purchases</p>
              <div className="mt-6 flex items-center gap-2 font-bold text-blue-600">
                View History <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            {/* Background Decoration */}
            <FiPackage className="absolute -right-8 -bottom-8 text-gray-50 w-48 h-48 rotate-12" />
          </NavLink>

        </div>

        {/* Security / Settings Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Secure Sneakers Dashboard v1.2</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;