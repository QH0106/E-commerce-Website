import React, { useState, useEffect } from "react";
import axiosInstance from "../Author/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "../Css/ProDuct.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProDuct = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products/getAllProducts?page=1&size=100")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
      });
  }, []);

  const addToCart = (product) => {
    let currentUser;
    try {
      currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      toast.warning("Đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (!currentUser) {
      toast.warning("Đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const cartItem = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
    };

    axiosInstance
      .post("/carts/add", cartItem)
      .then(() => {
        toast.success(`${product.name} đã thêm vào giỏ hàng!`);
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const filteredProducts = [...products].sort((a, b) =>
    sort === "asc" ? a.price - b.price : b.price - a.price
  );

  const productsI3 = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes("i3")
  );
  const productsI5 = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes("i5")
  );
  const productsI7 = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes("i7")
  );

  const productsI9 = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes("i9")
  );

  return (
    <div className="PagePd">
      <div className="bannerH">
        <div className="slideshow">
          <Carousel className="slide">
            <Carousel.Item>
              <a href="/ProDuct">
                <img
                  src="/banner1.jpg"
                  alt="slide 1"
                  className="d-block"
                  id="item"
                />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct">
                <img
                  src="/banner2.jpg"
                  alt="slide 2"
                  className="d-block"
                  id="item"
                />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct">
                <img
                  src="/banner3.jpg"
                  alt="slide 3"
                  className="d-block"
                  id="item"
                />
              </a>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <select
          className="form-select w-25"
          onChange={(e) => setSort(e.target.value)}
          style={{ marginBottom: "30px" }}
        >
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Section I3 */}
      <h2>Intel Core i3</h2>
      <div className="Pd" style={{ justifyItems: "center" }}>
        <div className="container row mt-3">
          {productsI3.slice(0, 8).map((product) => (
            <div key={product.id} className="col-md-3 mb-3">
              <div
                className="card p-3"
                onClick={() => navigate(`/Detail/${product.id}`)}
                style={{ backgroundColor: "#F8F4F4", cursor: "pointer" }}
              >
                <img
                  className="card-img-top"
                  src={product.thumbnail || product.image || "/unnamed.png"}
                  alt={product.name}
                  style={{ margin: "auto" }}
                />
                <h5>{product.name}</h5>
                <p style={{ color: "#000000" }}>{product.brand}</p>
                <p style={{ color: "red" }}>
                  Giá: {product.price.toLocaleString("vi-VN")}₫
                </p>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
          <div className="text-center mt-3">
            <button
              onClick={() => navigate("/ProductI3")}
              className="load btn btn-primary"
            >
              Xem Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Section I5 */}
      <h2 style={{ marginTop: "10px" }}>Intel Core i5</h2>
      <div className="Pd" style={{ marginTop: "10px", justifyItems: "center" }}>
        <div className="container row mt-3">
          {productsI5.slice(0, 8).map((product) => (
            <div key={product.id} className="col-md-3 mb-3">
              <div
                className="card p-3"
                onClick={() => navigate(`/Detail/${product.id}`)}
                style={{ backgroundColor: "#F8F4F4", cursor: "pointer" }}
              >
                <img
                  className="card-img-top"
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  style={{ margin: "auto" }}
                />
                <h5>{product.name}</h5>
                <p style={{ color: "#000000" }}>{product.brand}</p>
                <p style={{ color: "red" }}>
                  Giá: {product.price.toLocaleString("vi-VN")}₫
                </p>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
          <div className="text-center mt-3">
            <button
              onClick={() => navigate("/ProductI5")}
              className="load btn btn-primary"
            >
              Xem Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Section I7 */}
      <h2 style={{ marginTop: "10px" }}>Intel Core i7</h2>
      <div className="Pd" style={{ marginTop: "10px", justifyItems: "center" }}>
        <div className="container row mt-3">
          {productsI7.slice(0, 8).map((product) => (
            <div key={product.id} className="col-md-3 mb-3">
              <div
                className="card p-3"
                onClick={() => navigate(`/Detail/${product.id}`)}
                style={{ backgroundColor: "#F8F4F4", cursor: "pointer" }}
              >
                <img
                  className="card-img-top"
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  style={{ margin: "auto" }}
                />
                <h5>{product.name}</h5>
                <p style={{ color: "#000000" }}>{product.brand}</p>
                <p style={{ color: "red" }}>
                  Giá: {product.price.toLocaleString("vi-VN")}₫
                </p>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
          <div className="text-center mt-3">
            <button
              onClick={() => navigate("/ProductI7")}
              className="load btn btn-primary"
            >
              Xem Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Section I9 */}
      <h2 style={{ marginTop: "10px" }}>Intel Core i9</h2>
      <div className="Pd" style={{ marginTop: "10px", justifyItems: "center" }}>
        <div className="container row mt-3">
          {productsI9.slice(0, 8).map((product) => (
            <div key={product.id} className="col-md-3 mb-3">
              <div
                className="card p-3"
                onClick={() => navigate(`/Detail/${product.id}`)}
                style={{ backgroundColor: "#F8F4F4", cursor: "pointer" }}
              >
                <img
                  className="card-img-top"
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  style={{ margin: "auto" }}
                />
                <h5>{product.name}</h5>
                <p style={{ color: "#000000" }}>{product.brand}</p>
                <p style={{ color: "red" }}>
                  Giá: {product.price.toLocaleString("vi-VN")}₫
                </p>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
          <div className="text-center mt-3">
            <button
              onClick={() => navigate("/ProductI9")}
              className="load btn btn-primary"
            >
              Xem Thêm
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        closeButton={false}
      />
    </div>
  );
};

export default ProDuct;
