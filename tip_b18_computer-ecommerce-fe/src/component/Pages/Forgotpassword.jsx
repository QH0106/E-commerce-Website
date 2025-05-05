import React, { useState } from "react";
import axiosInstance from "../Author/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './Login';

export const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email không được để trống!");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/users/forgotPassword?email=${encodeURIComponent(email)}`);
      if (response.data.statusCode === 200) {
        setMessage(`Một liên kết đặt lại mật khẩu đã được gửi tới ${email}`);
        setTimeout(() => {
          Navigate("/Login");
        }, 2000);
      } else {
        setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage("Không thể gửi yêu cầu. Vui lòng kiểm tra lại kết nối.", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{margin:"auto"}}>
            {isLoading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
          </button>
        </form>

        {message && <p className={`mt-3 text-center ${message.includes("lỗi") ? "text-danger" : "text-success"}`}>{message}</p>}

        <div className="text-center mt-3">
          <button className="btn btn-link p-0" style={{margin:"auto"}}>
            <a href="/Login" style={{ color: "#000", textDecoration: "none"}}>
              Quay lại trang đăng nhập
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
