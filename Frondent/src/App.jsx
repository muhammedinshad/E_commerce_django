import React from "react"
import { ToastContainer } from "react-toastify";
import Login from "./page/Brand/Login"
import Register from "./page/Brand/Register"
import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./page/Brand/Home/Home"
import Deteals from "./page/Brand/Deteals"
import NewBalance from "./page/Brand/Brand/NewBalance"
import Adidas from "./page/Brand/Brand/Adidas"
import Nike from "./page/Brand/Brand/Nike"
import Puma from "./page/Brand/Brand/Puma"
import Profile from "./page/Brand/profile"
import Cart from "./page/Brand/Cart"
import Footer from "./Components/Footer"
import NaveBar from "./Components/NaveBar"
import Product from "./page/Brand/Home/Product"
import PlaceOrder from "./page/Brand/placeOrder"
import OrderPage from "./page/Brand/OrderPage"
import OrderSuccessfully from "./page/Brand/OrderSuccessfully"
// Admin side
import Admin from "./AdiminPage/Admin"


import { useEffect } from "react";
import { initRefresh } from "./api/api";


function App() {
  const location = useLocation();

  useEffect(() => {
    initRefresh();
  }, []);

  const token = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  // Debug log to help track transitions
  useEffect(() => {
    console.log(`Route changed to: ${location.pathname}, isAdmin: ${isAdmin}`);
  }, [location, isAdmin]);

  return (
    <div className="bg-linear-to-br from-green-50 to-gray-100">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      {!isAdmin && <NaveBar />}
      <Routes>
        <Route path="adminpage/*" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="product" element={<Product />} />
        <Route path="deteals/:id" element={<Deteals />} />
        <Route path="adidas" element={<Adidas />} />
        <Route path="newbalance" element={<NewBalance />} />
        <Route path="nike" element={<Nike />} />
        <Route path="puma" element={<Puma />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cart" element={<Cart />} />
        <Route path="placeorder" element={<PlaceOrder />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="ordersuccess" element={<OrderSuccessfully />} />
      </Routes>
    </div>
  );
}

export default App
