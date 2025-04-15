import React, { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./component/Pages/HomePage";
import Login from "./component/Pages/Login";
import Register from "./component/Pages/Register";
import Forgotpassword from "./component/Pages/Forgotpassword";
import ProDuct from "./component/Pages/ProDuct";
import Admin from "./component/Admins/Admin";
import ProductManagement from "./component/Admins/ProductManagement";
import Detail from "./component/Pages/Detail";
import Cart from "./component/Pages/Cart";
import ProfilePage from "./component/Pages/ProfilePage";
import MainLayout from "./component/modules/MainLayout";
import ProductI3 from "./component/Pages/ProductI3";
import { setAuthToken } from "./component/Author/axiosInstance";


function App() {
    const [cart, setCart] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token); // ✅ Gán token vào axios headers
      }
    }, []);
  return (
    <div className="home">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />  
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/ProDuct" element={<ProDuct cart={cart} setCart={setCart} />} />
          <Route path="/Cart" element={<Cart cart={cart} />} /> 
          <Route path="/Detail" element={<Detail />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/ProductI3" element={<ProductI3 />} />
          
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Forgotpassword" element={<Forgotpassword />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/ProductManagement" element={<ProductManagement />} />
        
      </Routes>
    </div>
  );
}

export default App;
