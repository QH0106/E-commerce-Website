import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/ProDuct.css"


const products = [
  { id: 1, name: "Gaming PC 1", old: "33.210.000₫", sale: "7%", price: 9990000, category: "Gaming PC", image: "/public/image-1.png" },
  { id: 2, name: "Workstation 1", old: "33.210.000₫", sale: "7%", price: 12390000, category: "Workstation", image: "/public/image-2.png" },
  { id: 3, name: "Laptop 1", old: "33.210.000₫", sale: "7%", price: 11290000, category: "Laptop", image: "/public/image-3.png" },
  { id: 4, name: "Gaming PC 2", old: "33.210.000₫", sale: "7%", price: 6990000, category: "Gaming PC", image: "/public/image-4.png" },
  { id: 5, name: "Gaming PC 3", old: "33.210.000₫", sale: "7%", price: 8090000, category: "Gaming PC", image: "/public/image-1.png" },
  { id: 6, name: "Workstation 2", old: "33.210.000₫", sale: "7%", price: 8990000, category: "Workstation", image: "/public/image-2.png" },
  { id: 7, name: "Laptop 2", old: "33.210.000₫", sale: "7%", price: 10090000, category: "Laptop", image: "/public/image-3.png" },
  { id: 8, name: "Gaming PC 4", old: "33.210.000₫", sale: "7%", price: 8099999, category: "Gaming PC", image: "/public/image-4.png" },
];


const ProDuct = () => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("price");
  const [suggestions, setSuggestions] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} đã thêm vào giỏ hàng!`);
  };

  const filteredProducts = products
    .filter((p) => (filter === "All" ? true : p.category === filter))
    // .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === "price" ? a.price - b.price : b.rating - a.rating));

    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearch(value);
    
      if (value === "") {
        setSuggestions([]); // Không hiển thị gợi ý nếu không nhập gì
      } else {
        const filtered = products.filter((p) => p.name.toLowerCase().includes(value));
        setSuggestions(filtered);
      }
    };
    
  return (
    <div className="PageHm">
      {/* Header */}
        <div className="header">
          <nav className="navbar">
            {/* <div className="infor">
            <i class="fa-solid fa-phone"></i><p>0123456789</p>
            <i class="fa-solid fa-location-dot"></i><p>TP Quy Nhơn</p>
            </div> */}
            <a className="brand" href="/HomePage">PC Store</a>
            <div className="search">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm kiếm..."
              onChange={handleSearch}
              value={search}
            />
                {/* danh sách gợi ý */}
              {suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((item) => (
                    <div key={item.id} className="suggestion-item">
                      <img src={item.image} alt={item.name} width="40" height="40" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div>
              <a href="#">
                <i className="fa-solid fa-cart-shopping"></i>
                {cart.length > 0 && <span>{cart.length}</span>}
              </a>
              <a href="/Login"><i class="fa-solid fa-user"></i></a>
              </div>
            </div>
          </nav>
        </div>

      <div className="row banner">
        <div className="col-6 menu">
          <ul><h1>Danh mục</h1>
            <li>Tất cả sản phẩm</li>
            <li>PC Gaming - Máy tính chơi game</li>
            <li>Laptop</li>
            <li>Khuyến mãi</li>
          </ul>
        </div>

        <div className="col-6 bgtext">
          <img src="/case.jpg" alt="demo" />
          <h2>Giá Tốt khuyến mãi Khủng</h2>
        </div>
      </div>

        {/* Bộ lọc */}
      <div className="container mt-3">
        <div className="d-flex justify-content-between">
          <select className="form-select w-25" onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Tất cả</option>
            <option value="Gaming PC">Gaming PC</option>
            <option value="Workstation">Workstation</option>
            <option value="Laptop">Laptop</option>
          </select>
          <select className="form-select w-25" onChange={(e) => setSort(e.target.value)}>
            <option value="price">Sắp xếp theo giá</option>
            <option value="rating">Sắp xếp theo đánh giá</option>
          </select>
        </div>
      </div>

        {/* Danh sách sản phẩm */}
        <div>
          <div className="container mt-3">
            <h2 style={{color:"#000", fontSize: "30px" }}>PC Cấu Hình I3/R3</h2>
            <div className="row">
              {filteredProducts.slice(0,4).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px"}}>
                    <img class="card-img-top" src={product.image} alt="{product.id}" />
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                    <p>Đánh giá: {product.rating}⭐</p>
                    <button className="btncard" onClick={() => addToCart(product)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
              <button href="" className="load">Xem Thêm</button>
            </div>

          
          <div className="container mt-3">
            <h2 style={{color:"#000", fontSize: "30px" }}>PC Cấu Hình I5/R5</h2>
            <div className="row">
              {filteredProducts.slice(0,4).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px"}}>
                    <img class="card-img-top" src={product.image} alt="{product.id}" />
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                    <p>Đánh giá: {product.rating}⭐</p>
                    <button className="btncard" onClick={() => addToCart(product)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
              <button href="" className="load">Xem Thêm</button>
            </div>
            </div>
            
          <div className="container mt-3">
            <h2 style={{color:"#000", fontSize: "30px", fontStyle: "bold"}}>PC Cấu Hình I7/R7</h2>
            <div className="row">
              {filteredProducts.slice(0,4).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px"}}>
                    <img class="card-img-top" src={product.image} alt="{product.id}" />
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                    <p>Đánh giá: {product.rating}⭐</p>
                    <button className="btncard" onClick={() => addToCart(product)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
              <button href="" className="load">Xem Thêm</button>
            </div>
            </div>
            
          </div>
      </div>
       {/* Footer */}
      <footer className="text-black text-center p-3 mt-4">
        <p>LOGONAME</p>
        <div>
          <ul>
            <li>Hệ thống cửa hàng</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Hướng dẫn trả góp</li>
            <li>Tra cứu địa chỉ bảo hành</li>
          </ul>
        </div>
        <div>
          <ul>HỖ TRỢ KHÁCH HÀNG:
            <li>Chính sách đổi trả</li>
            <li>Chính sách khách hàng thân thiết</li>
            <li>Giao hàng & phí giao hàng</li>
            <li> Chính sách bảo mật thông tin</li>
            <li> Chính sách đại lý</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default ProDuct;
