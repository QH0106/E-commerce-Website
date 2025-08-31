import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axiosInstance from "../Author/axiosInstance";
import "../Css/Navbar.css";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
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
        console.error("Error fetching product list:", error);
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

        const decoded = jwtDecode(token);
        user.id = decoded.jwtId;

        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify({ data: user }));
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        setIsLogin(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const currentUserRaw = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("token");
      const currentUser =
        currentUserRaw && currentUserRaw.data ? currentUserRaw.data : null;

      if (!currentUser || !token || !currentUser.id) {
        setTotalQuantity(0);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/carts/getCartByUserId/${currentUser.id}`
        );
        const cartData = response.data.data || response.data;
        const cartItems = cartData.cartDetails || [];
        const total = cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setTotalQuantity(total);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setTotalQuantity(0);
      }
    };

    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    setTotalQuantity(0);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-3 navbar-sticky">
      <a
        className="navbar-brand fw-bold"
        href="/HomePage"
        style={{ marginLeft: "100px", fontSize: "25px" }}
      >
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
        style={{ margin: "auto" }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mainNavbar">
        <ul
          className="navbar-nav me-auto mb-2 mb-lg-0"
          style={{ margin: "auto", gap: "20px" }}
        >
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="/ProDuct"
              id="pcDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              PC
            </a>
            <ul className="dropdown-menu" aria-labelledby="pcDropdown">
              <li>
                <a className="dropdown-item" href="/ProDuct">
                  Tất cả sản phẩm
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/ProductI3">
                  PC I3
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/ProductI5">
                  PC I5
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/ProductI7">
                  PC I7
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="laptopDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Laptop
            </a>
            <ul className="dropdown-menu" aria-labelledby="laptopDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  Laptop Gaming
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Laptop Văn phòng
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Laptop Sinh viên
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="gearDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Gear
            </a>
            <ul className="dropdown-menu" aria-labelledby="gearDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  Chuột
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Bàn phím
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Tai nghe
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <div className="d-flex flex-column flex-lg-row align-items-center w-100">
          <div
            className="me-lg-2 flex-grow-1 position-relative"
            ref={searchRef}
            style={{ left: "10px" }}
          >
            <input
              className="form-control"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={handleSearch}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions bg-white">
                {suggestions.map((item) => (
                  <div key={item.id} className="suggestion-item">
                    <a href={`/Detail/${item.id}`}>
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        width="40"
                        height="40"
                        style={{ marginRight: "20px" }}
                      />
                      <span>{item.name}</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart + User */}
        <div
          className="d-flex align-items-center ms-2 gap-4"
          style={{ marginRight: "50px" }}
        >
          <a
            href="/Cart"
            style={{ position: "relative", display: "inline-block" }}
          >
            <i
              className="fa-solid fa-cart-shopping"
              style={{ fontSize: "25px", color: "white" }}
            ></i>
            {totalQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {totalQuantity}
              </span>
            )}
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
                <i
                  className="fa-regular fa-user me-2"
                  style={{ fontSize: "25px", marginRight: "20px" }}
                ></i>
                {username}
              </span>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text">
                    <a href="/ProfilePage">Xin chào, {username}</a>
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                {isAdmin && (
                  <li>
                    <a className="dropdown-item" href="/Admin">
                      Trang Admin
                    </a>
                  </li>
                )}

                <li>
                  <a className="dropdown-item" href="/PurchaseHistoryPage">
                    Đơn hàng của tôi
                  </a>
                </li>
                <li>
                  <span
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </span>
                </li>
              </ul>
            </div>
          ) : (
            <a href="/Login" className="text-white">
              <i
                className="fa-solid fa-user"
                style={{ fontSize: "25px", marginRight: "20px" }}
              ></i>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
