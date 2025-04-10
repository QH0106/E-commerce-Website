import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Carousel } from 'react-bootstrap';
import "../Css/Homepage.css"

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [Isloggin, setIsLogin] = useState(false);
  const [Islogout, setIsLogout] = useState(false);
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.199.43:8080/api/products/getAllProducts?page=1&size=10&sort=false&sortBy=string");
        setProducts(response.data); //API trả về danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);


useEffect(() => {
  const user = JSON.parse(localStorage.getItem("currentUser"))?.username;
  
  if (user) {
    setUsername(user); // Cập nhật username vào state
  }}, []);

const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} đã thêm vào giỏ hàng!`);
};

// const filteredProducts = products

useEffect(() => {
  const loggin = localStorage.getItem('currentUser');
  if(loggin){
    setIsLogin(true)
  }else{
    setIsLogout(true)
  } 
}, [])

   
const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
  
    if (value === "") {
      setSuggestions([]); // Không hiển thị gợi ý
    } else {
      const filtered = products.filter((p) => p.name.toLowerCase().includes(value));
      setSuggestions(filtered);
    }
  };
    
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
  }


  return (
    <div className="PageHm">
      {/* Header */}
        <div className="header">
        <nav className="navbar navbar-expand-sm">
          <div className="container">
            <a className="brand" href="">Logo</a>
            
            <div className="collapse navbar-collapse" id="mynavbar">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="">PC</a>
                  <div className="dropdown" >
                    <a href="">1</a>
                    <a href="">2</a>
                    <a href="">3</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">Laptop</a>
                  <div className="dropdown" >
                    <a href="">1</a>
                    <a href="">2</a>
                    <a href="">3</a>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">Gear</a>
                  <div className="dropdown" >
                    <a href="">1</a>
                    <a href="">2</a>
                    <a href="">3</a>
                  </div>
                </li>
              </ul>
            
              <form className="search d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Tìm kiếm..."
                onChange={handleSearch}
                value={search}
              />
              {/* Hiển thị danh sách gợi ý */}
              {suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((item) => (
                    <div key={item.id} className="suggestion-item">
                      <a href="/">
                        <img src={item.image} alt={item.name} width="40" height="40" />
                        <span>{item.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
              </form>
            </div>
    
              <a href="/Cart">
                <i className="fa-solid fa-cart-shopping" style={{fontSize: "20px"}}></i>
                {cart.length > 0 && <span>{cart.length}</span>}
              </a>
              {Isloggin ? <a href="" type="Button" onClick={handleLogout} style={{cursor:"pointer", color:"white", textDecoration:"none"}}><i className="fa-regular fa-user" style={{fontSize: "20px", marginRight: "10px", textDecoration:"none"}} ></i>Xin Chào, {username}</a> : <a href="/Login" style={{cursor:"pointer"}}><i className="fa-solid fa-user" style={{fontSize: "20px", marginRight: "10px"}}></i></a>}  
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            </div>
          </nav>
        </div>

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
            <h2 style={{color:"#000", }}>Sản Phẩm nổi bật</h2>
            <div className="row">
              {products.slice(0, 4).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div href="" className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px", textDecoration: "none"}}>
                    <a href=""><img className="card-img-top" src={product.image} alt="{product.img}" /></a>
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price}</p>
                    {/* <p>Đánh giá: {product.rating}⭐</p> */}
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
            <h2 style={{color:"#000", }}>Sản Phẩm khuyến mãi</h2>
            <div className="row">
              {products.slice(0, 5).map((product) => (
                <div key={product.name} className="col-md-3">
                  <div className="card p-3" style={{backgroundColor: "#F8F4F4", marginTop:"10px"}}>
                    <img className="card-img-top" src={product.image} alt="{product.id}" />
                    <h5>{product.name}</h5>
                    <div style={{display: "flex"}}>
                      <p style={{textDecoration: "line-through", color: "#7C7979", marginRight: "10px"  }}>{product.old}</p>
                      <p style={{color: "#BC1616"}}>{product.sale}</p>
                    </div>
                    <p style={{color: "red",}}>Giá: {product.price}</p>
                    {/* <p>Đánh giá: {product.rating}⭐</p> */}
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

export default HomePage;
