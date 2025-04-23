import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "../Css/Homepage.css";
import axiosInstance from "../Author/axiosInstance";

const HomePage = () => {
  // const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

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

// const filteredProducts = products

const addToCart = (product) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
    return;
  }

  const cartItem = {
    userId: currentUser.id,
    productId: product.id,
    quantity: 1
  };

  axiosInstance.post("/carts/add", cartItem)
    .then(() => {
      alert(`${product.name} đã thêm vào giỏ hàng!`);
    })
    .catch((error) => {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    });
};
   
  return (
    <div className="PageHm">
      {/* Header */} 
      <div className="bannerH">
        {/* slide show */}
        <div className="slideshow">
          <Carousel className="slide">
            <Carousel.Item>
                <a href="/ProDuct"><img src="/banner1.jpg" alt="slide 1" className="d-block" id="item"/></a>            
            </Carousel.Item>
            <Carousel.Item>
                <a href="/ProDuct"><img src="/banner2.jpg" className="d-block" id="item"/></a>                
            </Carousel.Item>
            <Carousel.Item>
                <a href="/ProDuct"><img src="/banner3.jpg" alt="slide 3" className="d-block" id="item"/></a>           
            </Carousel.Item> 
          </Carousel>
        </div>
      </div>

      <div className=" d-flex justify-content-center align-items-start flex-nowrap gap-5">
        <div className="icon">
          <div className="itm" style={{marginLeft:"50px"}}>
            <i className="fa-solid fa-truck-fast" style={{fontSize:"40px"}}></i>
          </div>
          <p>Giao hàng nhanh, miễn phí</p>
        </div>
        <div className="icon" >
          <div className="itm">
            <i className="fa-solid fa-circle-check" style={{fontSize:"40px"}}></i>
          </div>   
            <p>Chính hãng</p>
        </div>
      <div>

        </div>
        <div>

        </div>
      </div>

        {/* Danh sách sản phẩm */}
        <div>
          <div className="container mt-3">
            <h2 style={{color:"#000", }}>Sản phẩm nổi bật</h2>
            <div className="row">
              {products.slice(0, 4).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px", textDecoration: "none"}}>
                    <Link to={`/Detail/${product.id}`}><img className="card-img-top" src={product.thumbnail} alt="{product.img}" /></Link>
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price}</p>
                    <button className="btncard" onClick={() => addToCart(product)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <div>
          <div className="container mt-3">
            <h2 style={{color:"#000", }}>Sản phẩm khuyến mãi</h2>
            <div className="row">
              {products.slice(0, 5).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px"}}>
                  <Link to={`/Detail/${product.id}`}><img className="card-img-top" src={product.thumbnail} alt="{product.img}" /></Link>
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price}</p>
                    <button className="btncard" onClick={() => addToCart(product)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
