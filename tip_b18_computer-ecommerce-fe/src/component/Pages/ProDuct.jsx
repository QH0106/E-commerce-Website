import React, { useState, useEffect } from "react";
import axiosInstance from "../Author/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from 'react-bootstrap';
import "../Css/ProDuct.css";

const ProDuct = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("price");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("http://192.168.199.43:8080/api/products/getAllProducts?page=1&size=10&sort=false&sortBy=name") 
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
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
      userId: currentUser.id, // Sửa lại lấy id nếu API yêu cầu
      productId: product.id,
      quantity: 1
    };

    axiosInstance.post("http://192.168.199.43:8080/api/carts/add", cartItem)
      .then(() => {
        alert(`${product.name} đã thêm vào giỏ hàng!`);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const filteredProducts = products
    .filter((p) => (filter === "All" ? true : p.category === filter))
    .sort((a, b) => (sort === "price" ? a.price - b.price : b.price - a.price));

  return (
    <div className="PageHm container-fluid">
      <div className="bannerH">
        <div className="slideshow">
          <Carousel className="slide">
            <Carousel.Item>
              <a href="/ProDuct"><img src="/banner1.jpg" alt="slide 1" className="d-block" id="item" /></a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct"><img src="/banner2.jpg" alt="slide 2" className="d-block" id="item" /></a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="/ProDuct"><img src="/banner3.jpg" alt="slide 3" className="d-block" id="item" /></a>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <select className="form-select w-25" onChange={(e) => setFilter(e.target.value)}>
          <option value="All">Tất cả</option>
          <option value="Gaming PC">Gaming PC</option>
          <option value="Workstation">Workstation</option>
          <option value="Laptop">Laptop</option>
        </select>
        <select className="form-select w-25" onChange={(e) => setSort(e.target.value)}>
          <option value="price">Giá tăng dần</option>
          <option value="rating">Giá giảm dần</option>
        </select>
      </div>

      {/* Section I3 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I3</h2>
        {filteredProducts.slice(0, 8).map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <div className="card p-3" style={{ backgroundColor: "#F8F4F4" }}>
              <img className="card-img-top" src={product.thumbnail || product.image} alt={product.name} />
              <h5>{product.name}</h5>
              <p style={{ color: "#000000" }}>{product.brand}</p>
              <p style={{ color: "red" }}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
              <button className="btn btn-danger" onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        ))}
        <button onClick={() => navigate("/ProductI3")} className="load btn btn-primary">Xem Thêm</button>
      </div>

      {/* Section I5 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I5</h2>
        {filteredProducts.slice(0, 8).map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <div className="card p-3" style={{ backgroundColor: "#F8F4F4" }}>
              <img className="card-img-top" src={product.thumbnail || product.image} alt={product.name} />
              <h5>{product.name}</h5>
              <p style={{ color: "#000000" }}>{product.brand}</p>
              <p style={{ color: "red" }}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
              <button className="btn btn-danger" onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        ))}
        <button onClick={() => navigate("/ProductI5")} className="load btn btn-primary">Xem Thêm</button>
      </div>

      {/* Section I7 */}
      <div className="row mt-4">
        <h2 style={{ color: "#000" }}>I7</h2>
        {filteredProducts.slice(0, 8).map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <div className="card p-3" style={{ backgroundColor: "#F8F4F4" }}>
              <img className="card-img-top" src={product.thumbnail || product.image} alt={product.name} />
              <h5>{product.name}</h5>
              <p style={{ color: "#000000" }}>{product.brand}</p>
              <p style={{ color: "red" }}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
              <button className="btn btn-danger" onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        ))}
        <button onClick={() => navigate("/ProductI7")} className="load btn btn-primary">Xem Thêm</button>
      </div>
    </div>
  );
};

export default ProDuct;
