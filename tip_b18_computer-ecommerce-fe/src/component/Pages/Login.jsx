import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";
import axiosInstance, { setAuthToken } from "../Author/axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setMessage("username và mật khẩu không được để trống!");
      return;
    }

    try {
      const response = await axiosInstance.post("/v1/auth/login", {
        username,
        password,
      });

      console.log("RESPONSE LOGIN:", response.data);

      if (response.data.statusCode === 200) {
        const userData = response.data.data;
      
        const { accessToken, ...userInfo } = userData;
      
        setAuthToken(accessToken);
        localStorage.setItem("token", accessToken); 
        localStorage.setItem("currentUser", JSON.stringify(userInfo)); 
      
        alert("Đăng nhập thành công!");
        navigate("/HomePage");
      }
       else {
        alert(response.data.message || "Sai username hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="backgroundLogin"></div>
      <div className="form-login">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="group">
            <label htmlFor="username">Tên</label>
            <input
              type="username"
              id="username"
              name="username"
              placeholder="Nhập username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-container">
              <input
                type={formData.showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
              />
              <i
                className={`fa-solid ${formData.showPassword ? "fa-eye" : "fa-eye-slash"}`}
                onClick={togglePassword}
                aria-label="Hiển thị / Ẩn mật khẩu"
                tabIndex={0}
              ></i>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/Forgotpassword">Quên mật khẩu?</a>
          </div>

          <button type="submit">Đăng nhập</button>

          {message && <p className="message">{message}</p>}

          <p className="text">Hoặc tiếp tục với</p>

          <div className="icon-social">
            <div className="link-social">
              <a href="/"><i className="fa-brands fa-google"></i></a>
            </div>
          </div>

          <div className="register">
            Bạn chưa có tài khoản? <a href="/Register">Đăng ký ngay</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
