import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../Author/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Button, Tabs, Tab, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Auth context
const AuthContext = createContext();

// Sidebar
const Sidebar = () => (
  <div
    className="d-flex flex-column p-3 bg-dark text-white vh-100"
    style={{ width: "250px" }}
  >
    <span>
      <h4 className="mb-4">Dashboard</h4>
    </span>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link className="nav-link text-white" to="/Admin">
          Doanh thu
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/ProductManagement">
          Sản phẩm
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/UserManagement">
          Người dùng
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/CategoriesManagement">
          Danh mục
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/OrderManagement">
          Order
        </Link>
      </li>
      <li className="nav-item mt-auto" style={{ margin: "auto" }}>
        <Button
          variant="success"
          href="/Homepage"
          style={{ marginTop: "100px" }}
        >
          Trang chủ
        </Button>
      </li>
    </ul>
  </div>
);

// Admin Layout
const AdminLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  </div>
);

// AuthProvider
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const RevenueStatistics = () => {
  const [key, setKey] = useState("top-products");
  const [topProducts, setTopProducts] = useState([]);
  const [revenueByWeek, setRevenueByWeek] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/statistics/top-products");
      setTopProducts(res.data.data);
    } catch (error) {
      console.error("Error top sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueByWeek = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "/statistics/revenue-by-period?period=WEEK"
      );
      const formattedData = res.data.data.dailyRevenue.map((item) => ({
        period: item.week,
        revenue: item.totalRevenue,
      }));
      setRevenueByWeek(formattedData);
    } catch (error) {
      console.error("Error fetching revenue by week:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueByDate = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/statistics/revenue-by-date");
      const formattedData = res.data.data.map((item) => ({
        date: item.date,
        revenue: item.totalRevenue,
      }));
      setRevenueByDate(formattedData);
    } catch (error) {
      console.error("Error fetching revenue by date:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key === "top-products") fetchTopProducts();
    if (key === "revenue-week") fetchRevenueByWeek();
  }, [key]);

  return (
    <Container fluid>
      <h2 className="mb-4">Thống kê doanh thu</h2>
      <Tabs
        id="revenue-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 admin-custom"
      >
        <Tab eventKey="top-products" title="Top sản phẩm bán chạy">
          {loading ? (
            <Spinner animation="border" />
          ) : topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="productName" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantitySold" fill="#82ca9d" name="Số Lượng" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center mt-3">Không có dữ liệu</div>
          )}
        </Tab>

        <Tab eventKey="revenue-week" title="Doanh thu theo tuần">
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueByWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Doanh Thu" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

// AdminApp
const AdminApp = () => (
  <AuthProvider>
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout>
            <RevenueStatistics />
          </AdminLayout>
        }
      />
      <Route
        path="/ProductManagement"
        element={
          <AdminLayout>
            <h2>Quản lý sản phẩm</h2>
          </AdminLayout>
        }
      />
      <Route
        path="/UserManagement"
        element={
          <AdminLayout>
            <h2>Quản lý người dùng</h2>
          </AdminLayout>
        }
      />
      <Route
        path="/CategoriesManagement"
        element={
          <AdminLayout>
            <h2>Quản lý danh mục</h2>
          </AdminLayout>
        }
      />
      <Route
        path="/OrderManagement"
        element={
          <AdminLayout>
            <h2>Order</h2>
          </AdminLayout>
        }
      />
      <Route
        path="/login"
        element={<h2 className="text-center">Đăng nhập</h2>}
      />
    </Routes>
  </AuthProvider>
);

export default AdminApp;
