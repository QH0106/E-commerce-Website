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

      if (response.data.statusCode === 200) {
        const { accessToken } = response.data.data;

        // Gắn token vào header
        setAuthToken(accessToken);
        localStorage.setItem("token", accessToken);

        // Gọi API lấy thông tin user và role
        const infoResponse = await axiosInstance.get("/users/me");

        if (infoResponse.data) {
          const userInfo = infoResponse.data;
          localStorage.setItem("currentUser", JSON.stringify(userInfo));

          alert("Đăng nhập thành công!");

          // Kiểm tra role
          const roles = userInfo.roles || [];
          if (roles.includes("ROLE_ADMIN")) {
            navigate("/admin");
          } else {
            navigate("/HomePage");
          }
        } else {
          alert("Lỗi khi lấy thông tin người dùng!");
        }
      } else {
        alert(response.data.message || "Sai username hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "/v1/auth/oauth2/authorize/google";
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
            <div className="link-social" onClick={loginWithGoogle}>
              <i className="fa-brands fa-google" style={{ cursor: "pointer" }}></i>
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
