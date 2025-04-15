import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Author/axiosInstance";
import "../Css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // nhập dữ liệu vào form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // hiển thị mật khẩu
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePassword = () => {
    setShowRePassword(!showRePassword);
  };

const handleRegister = async (e) => {
  e.preventDefault();
  const { username, fullname, email, password, rePassword } = formData;

  // Kiểm tra các trường
  if (!username || !email || !password || !rePassword) {
    setMessage("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
  if (password !== rePassword) {
    setMessage("Mật khẩu không khớp!");
    return;
  }

  try {
    // Gửi yêu cầu đăng ký đến API
    const response = await axiosInstance.post("http://192.168.199.43:8080/api/v1/auth/register", {
      username,
      fullname,
      email,
      password,
    });

    // Kiểm tra kết quả phản hồi từ API
    if (response.data.username) {
      alert("Đăng ký thành công!");
      console.log("Thông tin người dùng đã đăng ký:", response.data);
      setTimeout(() => {
        navigate("/Login"); // Chuyển hướng về trang đăng nhập
      }, 1000);
    } else {
      alert(response.data.message || "Đã xảy ra lỗi khi đăng ký!");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
  }
};


  return (
    <>
      <div className="backgroundRegister"></div>
      <div className="form-register">
        <h2>Đăng Ký</h2>

        <form onSubmit={handleRegister}>
          <div className="group">
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="UserName"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="group">
            <label htmlFor="password">Mật Khẩu</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={togglePassword}
              ></i>
            </div>
          </div>

          <div className="group">
            <label htmlFor="rePassword">Nhập Lại Mật Khẩu</label>
            <div className="password-container">
              <input
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                id="rePassword"
                placeholder="Re-Password"
                value={formData.rePassword}
                onChange={handleChange}
              />
              <i
                className={`fa ${showRePassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={toggleRePassword}
              ></i>
            </div>
          </div>

          <button type="submit">Đăng Ký</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="Login">
          Bạn đã có tài khoản?<a href="/Login">Đăng Nhập!</a>
        </div>
      </div>
    </>
  );
};

export default Register;
