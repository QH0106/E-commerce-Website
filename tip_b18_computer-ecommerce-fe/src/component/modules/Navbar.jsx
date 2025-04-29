import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axiosInstance from "../Author/axiosInstance";
import "../Css/Navbar.css";

const Navbar = () => {
  const [cart] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products/getAllProducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLogin(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/users/me");
        const user = response.data.data;
        setIsLogin(true);
        setUsername(user.fullname || user.username || "User");
        setIsAdmin(user.roles.includes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        setIsLogin(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value === "") {
      setSuggestions([]);
    } else {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(value)
      );
      setSuggestions(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setIsLogin(false);
    setUsername("");
    setIsAdmin(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-3">
      <a className="navbar-brand fw-bold" href="/HomePage" style={{ marginLeft: "100px", fontSize: "25px" }}>
        ComputerShop
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mainNavbar">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ margin: "auto", gap: "20px" }}>
          {/* PC dropdown */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/ProDuct" id="pcDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              PC
            </a>
            <ul className="dropdown-menu" aria-labelledby="pcDropdown">
              <li><a className="dropdown-item" href="/ProDuct">Tất cả sản phẩm</a></li>
              <li><a className="dropdown-item" href="/ProductI3">PC I3</a></li>
              <li><a className="dropdown-item" href="/ProductI5">PC I5</a></li>
              <li><a className="dropdown-item" href="/ProductI7">PC I7</a></li>
            </ul>
          </li>

          {/* Laptop */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="laptopDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Laptop
            </a>
            <ul className="dropdown-menu" aria-labelledby="laptopDropdown">
              <li><a className="dropdown-item" href="#">Laptop Gaming</a></li>
              <li><a className="dropdown-item" href="#">Laptop Văn phòng</a></li>
              <li><a className="dropdown-item" href="#">Laptop Sinh viên</a></li>
            </ul>
          </li>

          {/* Gear */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="gearDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Gear
            </a>
            <ul className="dropdown-menu" aria-labelledby="gearDropdown">
              <li><a className="dropdown-item" href="#">Chuột</a></li>
              <li><a className="dropdown-item" href="#">Bàn phím</a></li>
              <li><a className="dropdown-item" href="#">Tai nghe</a></li>
            </ul>
          </li>
        </ul>

        {/* Search bar */}
        <div className="d-flex me-2 position-relative" ref={searchRef} style={{ width: "500px", paddingRight: "50px" }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Search"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Gợi ý */}
        {suggestions.length > 0 && (
          <div className="search-suggestions position-absolute bg-white">
            {suggestions.map((item) => (
              <div key={item.id} className="suggestion-item">
                <a href={`/Detail/${item.id}`}>
                  <img src={item.thumbnail} alt={item.name} width="40" height="40" />
                  <span>{item.name}</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Cart + User */}
        <div className="d-flex align-items-center ms-2 gap-4" style={{ marginRight: "50px" }}>
          <a href="/Cart">
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: "25px", color: "white" }}></i>
            {cart.length > 0 && <span>{cart.length}</span>}
          </a>

          {isLogin ? (
            <div className="dropdown">
              <span
                className="dropdown-toggle text-white d-flex align-items-center"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <i className="fa-regular fa-user me-2" style={{ fontSize: "25px", marginRight: "20px" }}></i>
                {username}
              </span>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item-text"><a href="/ProfilePage">Xin chào, {username}</a></span></li>
                <li><hr className="dropdown-divider" /></li>

                {isAdmin && (
                  <li><a className="dropdown-item" href="/Admin">Vào trang quản trị</a></li>
                )}

                <li><a className="dropdown-item" href="/PurchaseHistoryPage">Đơn hàng của tôi</a></li>
                <li>
                  <span className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>
                    Đăng xuất
                  </span>
                </li>
              </ul>
            </div>
          ) : (
            <a href="/Login" className="text-white">
              <i className="fa-solid fa-user" style={{ fontSize: "25px", marginRight: "20px" }}></i>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
