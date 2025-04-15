import React, { useState, useEffect } from "react";
import axiosInstance from "../Author/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/ProDuct.css";

const ProDuct = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sort, setSort] = useState("price");

  // Call API khi component mount
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
    setCart([...cart, product]);
    alert(`${product.name} đã thêm vào giỏ hàng!`);
  };

  const filteredProducts = products
    .sort((a, b) => (sort === "price" ? a.price - b.price : b.price - a.price));

  return (
    <div className="PageHm container-fluid">
      
      {/* Bộ lọc */}
      <div className="d-flex justify-content-between mt-3">
        <select className="form-select w-25" onChange={(e) => setSort(e.target.value)}>
          <option value="price">giá tăng dần</option>
          <option value="">giá giảm dần</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="row mt-4">
        <h2 style={{color:"#000", }}>I3</h2>
        {filteredProducts.slice(0, 9).map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <div className="card p-3" style={{ backgroundColor: "#F8F4F4" }}>
              <img className="card-img-top" src={product.image} alt='' />
              <h5>{product.name}</h5>
              {/* <p style={{ textDecoration: "line-through", color: "#7C7979" }}>{product.old}</p>
              <p style={{ color: "#BC1616" }}>{product.sale}</p> */}
              <p style={{ color: "#000000" }}>{product.brand}</p>
              <p style={{ color: "red" }}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
              {/* <p>Đánh giá: {product.rating || 5}⭐</p> */}
              <button className="btn btn-danger" onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        ))}
        <button href="" className="load">Xem Thêm</button>
      </div> 
    </div>
  )
};

export default ProDuct;
