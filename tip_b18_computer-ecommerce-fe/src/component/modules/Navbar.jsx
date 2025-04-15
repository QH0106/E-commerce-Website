import React, { useEffect, useState } from "react";
import "../Css/Homepage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../Author/axiosInstance";

const Navbar = () => {
  const [cart] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [Isloggin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("http://192.168.199.43:8080/api/products/getAllProducts?page=1&size=10&sort=false&sortBy=string");
        setProducts(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

// const filteredProducts = products

useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.username) {
    setIsLogin(true);
    setUsername(currentUser.username);
    setIsAdmin(currentUser.role === "ROLE_ADMIN");
  } else {
    setIsLogin(false);
    setUsername("");
  }
}, []);
   
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
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setIsLogin(false);
    setUsername("");
  };

  return (
      <div className="header">
        <nav className="navbar navbar-expand-sm">
          <div className="container">
            <a className="brand" href="/HomePage">Logo</a>
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
                        <img src={item.thumbnail} alt={item.name} width="40" height="40" />
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

              {isAdmin && <a href="/Admin">Admin</a>}

              {Isloggin ? (
                <span style={{color:"white"}}>
                  <i className="fa-regular fa-user" style={{fontSize: "20px", marginRight: "10px"}}></i>
                  Xin chào, {username} | <span onClick={handleLogout} style={{cursor:"pointer", color:"black"}}>Đăng xuất</span>
                </span>
              ) : (
                <a href="/Login" style={{cursor:"pointer"}}>
                  <i className="fa-solid fa-user" style={{fontSize: "20px", marginRight: "10px"}}></i>
                </a>
              )}

              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            </div>
          </nav>
        </div>
  );
};

export default Navbar;
