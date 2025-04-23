import React, { useState, useEffect } from "react";
import axiosInstance from "../Author/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "../Css/ProDuct.css";

const ProDuct = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products/getAllProducts?page=1&size=10&sort=false&sortBy=name")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
      });
  }, []);

  const addToCart = (product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
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
        alert(`${product.name} đã thêm vào giỏ hàng!`);
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

  return (
    <div className="PageHm container-fluid">
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
        >
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Section I3 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I3</h2>
        {productsI3.slice(0, 8).map((product) => (
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
        <button
          onClick={() => navigate("/ProductI3")}
          className="load btn btn-primary"
        >
          Xem Thêm
        </button>
      </div>

      {/* Section I5 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I5</h2>
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
        <button
          onClick={() => navigate("/ProductI5")}
          className="load btn btn-primary"
        >
          Xem Thêm
        </button>
      </div>

      {/* Section I7 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I7</h2>
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
        <button
          onClick={() => navigate("/ProductI7")}
          className="load btn btn-primary"
        >
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default ProDuct;
