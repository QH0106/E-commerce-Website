import React from "react";
import { Route, Routes } from "react-router";


const AdminApp = () => (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/products" element={<AdminLayout><h2>Quản lý sản phẩm</h2></AdminLayout>} />
        <Route path="/users" element={<AdminLayout><h2>Quản lý người dùng</h2></AdminLayout>} />
        <Route path="/categories" element={<AdminLayout><h2>Quản lý danh mục</h2></AdminLayout>} />
        <Route path="/payments" element={<AdminLayout><h2>Quản lý thanh toán</h2></AdminLayout>} />
        <Route path="/login" element={<h2 className="text-center">Đăng nhập</h2>} />
      </Routes>
    </AuthProvider>
  );

export default AdminApp;
