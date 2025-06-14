const AdminApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<AdminLayout><RevenueStatistics /></AdminLayout>} />
      <Route path="/ProductManagement" element={<AdminLayout><h2>Quản lý sản phẩm</h2></AdminLayout>} />
      <Route path="/UserManagement" element={<AdminLayout><h2>Quản lý người dùng</h2></AdminLayout>} />
      <Route path="/CategoriesManagement" element={<AdminLayout><h2>Quản lý danh mục</h2></AdminLayout>} />
      <Route path="/OrderManagement" element={<AdminLayout><h2>Order</h2></AdminLayout>} />
      <Route path="/login" element={<h2 className="text-center">Đăng nhập</h2>} />
    </Routes>
  </AuthProvider>
);

export default AdminApp;