import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import AdminOrders from "./page/AdminOrders";
import AdminUsers from "./page/AdminUsers";
import AdminProducts from "./page/AdminProducts";
import AddProduct from "./page/AdminAddProducte";
import ProductEdit from "./page/ProductEdit";
import AdminProfile from "./page/AdminProfile";
import AdminLayout from "./Adminlayout";

function Admin() {
  return (
    <AdminLayout>                      
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="adminorders"     element={<AdminOrders />} />
        <Route path="adminusers"      element={<AdminUsers />} />
        <Route path="adminproducts"   element={<AdminProducts />} />
        <Route path="adminaddproduct" element={<AddProduct />} />
        <Route path="editproduct"     element={<ProductEdit />} />
        <Route path="adminprofile"    element={<AdminProfile />} />
      </Routes>
    </AdminLayout>
  );
}


export default Admin;